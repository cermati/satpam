package com.cermati.satpam.internal;

import com.cermati.satpam.Message;
import com.cermati.satpam.RuleFunction;
import com.cermati.satpam.ShouldValidate;
import com.cermati.satpam.Undefined;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Converts Java input into the JS-shaped values {@link JsValues} works on: numbers become
 * {@link Double} (JS has one number type), maps get string keys, collections and arrays become
 * lists, Jackson {@link JsonNode}s are unwrapped ({@code MissingNode} becomes {@link Undefined})
 * and any other object (a POJO) goes through Jackson first.
 */
public final class Normalizer {
  private final ObjectMapper objectMapper;

  public Normalizer(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public Object normalize(Object value) {
    if (value == null || value instanceof Undefined || value instanceof String || value instanceof Boolean) {
      return value;
    }
    if (value instanceof Double) {
      return value;
    }
    if (value instanceof Number) {
      return ((Number) value).doubleValue();
    }
    if (value instanceof Character) {
      return value.toString();
    }
    if (value instanceof Enum) {
      return ((Enum<?>) value).name();
    }
    // Callables used in rule objects (shouldValidate) and raw bytes (file rules) pass through
    if (value instanceof ShouldValidate || value instanceof RuleFunction || value instanceof Message
      || value instanceof byte[]) {
      return value;
    }
    if (value instanceof Optional) {
      Optional<?> optional = (Optional<?>) value;
      return optional.isPresent() ? normalize(optional.get()) : null;
    }
    if (value instanceof JsonNode) {
      return normalizeJson((JsonNode) value);
    }
    if (value instanceof Map) {
      Map<String, Object> result = new LinkedHashMap<>();
      for (Map.Entry<?, ?> entry : ((Map<?, ?>) value).entrySet()) {
        result.put(String.valueOf(entry.getKey()), normalize(entry.getValue()));
      }
      return result;
    }
    if (value instanceof Collection) {
      List<Object> result = new ArrayList<>();
      for (Object item : (Collection<?>) value) {
        result.add(normalize(item));
      }
      return result;
    }
    if (value.getClass().isArray()) {
      int length = Array.getLength(value);
      List<Object> result = new ArrayList<>(length);
      for (int i = 0; i < length; i++) {
        result.add(normalize(Array.get(value, i)));
      }
      return result;
    }
    // POJO: let Jackson turn it into maps/lists using the caller's ObjectMapper configuration
    return normalize(objectMapper.convertValue(value, Object.class));
  }

  private Object normalizeJson(JsonNode node) {
    if (node.isMissingNode()) {
      return Undefined.INSTANCE;
    }
    if (node.isNull()) {
      return null;
    }
    if (node.isTextual()) {
      return node.textValue();
    }
    if (node.isNumber()) {
      return node.doubleValue();
    }
    if (node.isBoolean()) {
      return node.booleanValue();
    }
    if (node.isArray()) {
      List<Object> result = new ArrayList<>(node.size());
      for (JsonNode item : node) {
        result.add(normalizeJson(item));
      }
      return result;
    }
    if (node.isObject()) {
      Map<String, Object> result = new LinkedHashMap<>();
      Iterator<Map.Entry<String, JsonNode>> fields = node.fields();
      while (fields.hasNext()) {
        Map.Entry<String, JsonNode> field = fields.next();
        result.put(field.getKey(), normalizeJson(field.getValue()));
      }
      return result;
    }
    if (node.isPojo()) {
      return normalize(((com.fasterxml.jackson.databind.node.POJONode) node).getPojo());
    }
    return node.asText();
  }
}
