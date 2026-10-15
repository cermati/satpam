package com.cermati.satpam;

import com.cermati.satpam.annotation.AnyOf;
import com.cermati.satpam.annotation.Label;
import com.cermati.satpam.annotation.Msg;
import com.cermati.satpam.annotation.Rules;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.AnnotatedMember;
import com.fasterxml.jackson.databind.introspect.BeanPropertyDefinition;

import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Member;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Builds a satpam rule mapping from the {@link Rules}, {@link AnyOf} and {@link Label} annotations
 * of a class. The result is the same {@code Map}/{@code List} tree that {@link SatpamValidator#validate}
 * takes, so annotated and hand-written rules behave identically:
 *
 * <pre>
 * class Applicant {
 *   &#64;Rules({"required", "minLength:3"}) String name;     // "name": ["required", "minLength:3"]
 *   &#64;AnyOf({"email", "mobilePhoneNumber"}) String contact; // "contact": [["email", "mobilePhoneNumber"]]
 *   Office office;                                       // "office": {...rules of Office...}
 * }
 * </pre>
 *
 * <p>Property names come from Jackson's bean introspection, the same that turns the bean into the
 * validated input, so {@code @JsonProperty} and naming strategies line up. A property whose type is
 * another annotated class becomes a nested mapping; if the property also has its own rules they go
 * under {@link SatpamValidator#OWN_RULES_KEY}. Collections are not descended into, as in satpam.
 * A class that refers back to itself is not descended into again.
 *
 * <p>{@link Label} and {@link Msg} become the Java-only {@code $label} and {@code $message} keys of
 * object rules; {@code when} becomes {@code shouldValidate}.
 *
 * <p>Usually you don't call this directly: {@link SatpamValidator#validateBean} derives and caches
 * the mapping per class.
 */
public final class AnnotatedRules {
  private static final ObjectMapper DEFAULT_MAPPER = new ObjectMapper();
  private static final Map<Class<?>, ShouldValidate> CONDITIONS = new ConcurrentHashMap<>();

  private AnnotatedRules() {
  }

  /** Rule mapping of {@code type}, with property names from a plain {@code ObjectMapper}. */
  public static Map<String, Object> of(Class<?> type) {
    return of(type, DEFAULT_MAPPER);
  }

  /**
   * Rule mapping of {@code type}, with property names from {@code objectMapper}. Use the same mapper
   * as the validator ({@link SatpamValidator.Builder#objectMapper}).
   *
   * @throws SatpamException if an annotation is on a member Jackson does not serialize, a rule entry
   *   is malformed, a {@link Msg} names a rule that is not there, or a {@code when} class can't be created
   */
  public static Map<String, Object> of(Class<?> type, ObjectMapper objectMapper) {
    return Collections.unmodifiableMap(derive(type, objectMapper, new HashSet<>()));
  }

  private static Map<String, Object> derive(Class<?> type, ObjectMapper mapper, Set<Class<?>> inProgress) {
    inProgress.add(type);
    BeanDescription description = mapper.getSerializationConfig().introspect(mapper.constructType(type));
    Map<String, Object> mapping = new LinkedHashMap<>();
    Set<AnnotatedElement> used = new HashSet<>();

    for (BeanPropertyDefinition property : description.findProperties()) {
      Set<AnnotatedElement> elements = annotatedElements(type, property);
      used.addAll(elements);
      List<Object> ruleArray = ruleArray(type, property.getName(), elements, mapper);

      Class<?> propertyType = property.getRawPrimaryType();
      Map<String, Object> nested = isBean(propertyType) && !inProgress.contains(propertyType)
        ? derive(propertyType, mapper, inProgress)
        : Collections.emptyMap();

      if (!nested.isEmpty()) {
        Map<String, Object> withOwnRules = new LinkedHashMap<>();
        if (!ruleArray.isEmpty()) {
          withOwnRules.put(SatpamValidator.OWN_RULES_KEY, ruleArray);
        }
        withOwnRules.putAll(nested);
        mapping.put(property.getName(), withOwnRules);
      } else if (!ruleArray.isEmpty()) {
        mapping.put(property.getName(), ruleArray);
      }
    }

    requireAllUsed(type, used);
    inProgress.remove(type);
    return mapping;
  }

  /** Field and getter of the property, including a private field behind a getter. */
  private static Set<AnnotatedElement> annotatedElements(Class<?> type, BeanPropertyDefinition property) {
    Set<AnnotatedElement> elements = new LinkedHashSet<>();
    addMember(elements, property.getField());
    if (property.getField() == null) {
      Field field = findField(type, property.getInternalName());
      if (field != null) {
        elements.add(field);
      }
    }
    addMember(elements, property.getGetter());
    return elements;
  }

  private static void addMember(Set<AnnotatedElement> elements, AnnotatedMember member) {
    if (member != null && member.getAnnotated() instanceof AnnotatedElement) {
      elements.add((AnnotatedElement) member.getAnnotated());
    }
  }

  private static Field findField(Class<?> type, String name) {
    for (Class<?> c = type; c != null && c != Object.class; c = c.getSuperclass()) {
      for (Field field : c.getDeclaredFields()) {
        if (field.getName().equals(name) && !Modifier.isStatic(field.getModifiers())) {
          return field;
        }
      }
    }
    return null;
  }

  private static List<Object> ruleArray(Class<?> type, String propertyName, Set<AnnotatedElement> elements,
                                        ObjectMapper mapper) {
    String label = null;
    for (AnnotatedElement element : elements) {
      Label annotation = element.getAnnotation(Label.class);
      if (annotation != null) {
        label = annotation.value();
      }
    }

    List<Object> ruleArray = new ArrayList<>();
    for (AnnotatedElement element : elements) {
      String where = type.getName() + "." + propertyName;
      for (Rules rules : element.getAnnotationsByType(Rules.class)) {
        ruleArray.addAll(rules(where, rules.value(), rules.messages(), rules.when(), label, mapper));
      }
      for (AnyOf anyOf : element.getAnnotationsByType(AnyOf.class)) {
        ruleArray.add(rules(where, anyOf.value(), anyOf.messages(), anyOf.when(), label, mapper));
      }
    }
    return ruleArray;
  }

  private static List<Object> rules(String where, String[] entries, Msg[] msgs, Class<? extends ShouldValidate> when,
                                    String label, ObjectMapper mapper) {
    Map<String, String> messages = new LinkedHashMap<>();
    for (Msg msg : msgs) {
      messages.put(msg.rule(), msg.text());
    }
    ShouldValidate condition = when == ShouldValidate.class ? null : condition(when);

    List<Object> result = new ArrayList<>();
    Set<String> fullNames = new HashSet<>();
    for (String entry : entries) {
      Object rule = parseEntry(where, entry, mapper);
      RuleObject parsed = SatpamValidator.createRuleObject(rule);
      fullNames.add(parsed.getFullName());
      String message = messages.get(parsed.getFullName());
      if (message == null && label == null && condition == null) {
        result.add(rule);
        continue;
      }

      Map<String, Object> ruleObj;
      if (rule instanceof Map) {
        @SuppressWarnings("unchecked")
        Map<String, Object> map = new LinkedHashMap<>((Map<String, Object>) rule);
        ruleObj = map;
      } else {
        ruleObj = new LinkedHashMap<>();
        ruleObj.put("name", parsed.getName());
        ruleObj.put("params", new ArrayList<>(parsed.getParams()));
      }
      if (message != null) {
        ruleObj.put("$message", message);
      }
      if (label != null) {
        ruleObj.put("$label", label);
      }
      if (condition != null) {
        ruleObj.put("shouldValidate", condition);
      }
      result.add(ruleObj);
    }

    for (String rule : messages.keySet()) {
      if (!fullNames.contains(rule)) {
        throw new SatpamException("@Msg on " + where + " is for " + rule + ", which is not one of its rules " + fullNames);
      }
    }
    return result;
  }

  private static Object parseEntry(String where, String entry, ObjectMapper mapper) {
    if (!entry.trim().startsWith("{")) {
      return entry;
    }
    try {
      return mapper.readValue(entry, new TypeReference<LinkedHashMap<String, Object>>() {
      });
    } catch (JsonProcessingException e) {
      throw new SatpamException("Invalid JSON rule on " + where + ": " + entry, e);
    }
  }

  private static ShouldValidate condition(Class<? extends ShouldValidate> type) {
    return CONDITIONS.computeIfAbsent(type, c -> {
      try {
        Constructor<?> constructor = c.getDeclaredConstructor();
        constructor.setAccessible(true);
        return (ShouldValidate) constructor.newInstance();
      } catch (ReflectiveOperationException | RuntimeException e) {
        throw new SatpamException("Cannot create " + c.getName() + " for @Rules(when); it needs a no-arg constructor", e);
      }
    });
  }

  /** Classes worth looking into for nested rules: user beans, not JDK, Jackson or container types. */
  private static boolean isBean(Class<?> type) {
    if (type == null || type.isPrimitive() || type.isArray() || type.isEnum() || type.isInterface()) {
      return false;
    }
    if (Iterable.class.isAssignableFrom(type) || Map.class.isAssignableFrom(type) || Optional.class == type
      || JsonNode.class.isAssignableFrom(type)) {
      return false;
    }
    String name = type.getName();
    return !(name.startsWith("java.") || name.startsWith("javax.") || name.startsWith("jakarta.")
      || name.startsWith("com.fasterxml."));
  }

  /** Fails on annotations Jackson can't see (private field without getter, {@code @JsonIgnore}, ...). */
  private static void requireAllUsed(Class<?> type, Set<AnnotatedElement> used) {
    for (Class<?> c = type; c != null && c != Object.class; c = c.getSuperclass()) {
      List<AnnotatedElement> members = new ArrayList<>();
      Collections.addAll(members, c.getDeclaredFields());
      Collections.addAll(members, c.getDeclaredMethods());
      for (AnnotatedElement member : members) {
        if (!Modifier.isStatic(((Member) member).getModifiers()) && hasSatpamAnnotation(member) && !used.contains(member)) {
          String kind = member instanceof Method ? "method" : "field";
          throw new SatpamException("Satpam annotation on " + kind + " " + c.getName() + "." + ((Member) member).getName()
            + " is not a property Jackson serializes; make it public, add a getter, or remove @JsonIgnore");
        }
      }
    }
  }

  private static boolean hasSatpamAnnotation(AnnotatedElement element) {
    return element.getAnnotationsByType(Rules.class).length > 0 || element.getAnnotationsByType(AnyOf.class).length > 0
      || element.isAnnotationPresent(Label.class);
  }
}
