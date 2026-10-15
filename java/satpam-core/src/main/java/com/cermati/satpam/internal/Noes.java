package com.cermati.satpam.internal;

import com.cermati.satpam.SatpamException;
import com.cermati.satpam.Undefined;

import java.util.List;
import java.util.Map;
import java.util.function.BiPredicate;

/**
 * Port of noes 1.1.1, the conjunction library satpam uses for {@code shouldValidate},
 * {@code requiredIf} and {@code requiredIfNot}.
 *
 * <p>A conjunction is {@code {"type": "and"|"or", "mappings": {key: expected, ...}}}. Each mapping
 * compares {@code inputObj[key]} with {@code expected}:
 * <ul>
 *   <li>a scalar: deep equality ({@code R.equals})</li>
 *   <li>a predicate object such as {@code {">=": 17}} ({@code > >= === !== < <=} and their
 *   {@code $greaterThan}-style aliases)</li>
 *   <li>an array of predicates/scalars, combined with the conjunction's own and/or</li>
 *   <li>another conjunction object, evaluated against the same input</li>
 * </ul>
 * An {@code and} over no mappings is satisfied, an {@code or} over no mappings is not.
 */
public final class Noes {
  private Noes() {
  }

  /**
   * noes {@code Conjunction.shouldCreateConjunction}: an object with own {@code type} and
   * {@code mappings}. Throws for {@code null}/{@code undefined} like ramda {@code R.has} does.
   */
  public static boolean shouldCreateConjunction(Object value) {
    if (JsValues.isNil(value)) {
      throw new IllegalArgumentException("TypeError: Cannot convert undefined or null to object");
    }
    return value instanceof Map && JsValues.asMap(value).containsKey("type") && JsValues.asMap(value).containsKey("mappings");
  }

  /** noes {@code create(spec).satisfied(inputObj)}. */
  public static boolean satisfied(Object spec, Object inputObj) {
    Map<String, Object> conjunction = JsValues.asMap(spec);
    Object type = conjunction.get("type");
    boolean isAnd;
    if ("and".equals(type)) {
      isAnd = true;
    } else if ("or".equals(type)) {
      isAnd = false;
    } else {
      throw new SatpamException("Cannot create conjunction based on " + spec);
    }

    Object mappings = conjunction.get("mappings");
    if (!(mappings instanceof Map)) {
      // R.keys of a non-object is []
      return isAnd;
    }
    for (Map.Entry<String, Object> entry : JsValues.asMap(mappings).entrySet()) {
      boolean satisfied = mappingSatisfied(entry.getKey(), entry.getValue(), inputObj, isAnd);
      if (isAnd && !satisfied) {
        return false;
      }
      if (!isAnd && satisfied) {
        return true;
      }
    }
    return isAnd;
  }

  private static boolean mappingSatisfied(String key, Object mappingValue, Object inputObj, boolean isAnd) {
    // R.prop(key, inputObj): ramda 0.25 reads through R.path, so a nil inputObj gives undefined
    Object inputValue = JsValues.isNil(inputObj) ? Undefined.INSTANCE : JsValues.getProperty(inputObj, key);

    if (shouldCreateConjunction(mappingValue)) {
      return satisfied(mappingValue, inputObj);
    }
    if (mappingValue instanceof Map || mappingValue instanceof List) {
      return predicateSatisfied(mappingValue, inputValue, isAnd);
    }
    return JsValues.ramdaEquals(inputValue, mappingValue);
  }

  private static boolean predicateSatisfied(Object predicateObject, Object inputValue, boolean isAnd) {
    if (predicateObject instanceof List) {
      for (Object item : JsValues.asList(predicateObject)) {
        boolean satisfied = predicateSatisfied(item, inputValue, isAnd);
        if (isAnd && !satisfied) {
          return false;
        }
        if (!isAnd && satisfied) {
          return true;
        }
      }
      return isAnd;
    }
    if (predicateObject instanceof Map) {
      Map<String, Object> map = JsValues.asMap(predicateObject);
      if (map.isEmpty()) {
        // R.head([]) is undefined -> "undefined is not a valid predicate"
        throw new SatpamException("undefined is not a valid predicate");
      }
      Map.Entry<String, Object> first = map.entrySet().iterator().next();
      return predicate(first.getKey()).test(inputValue, first.getValue());
    }
    // Scalar: { '===': scalar }
    return JsValues.ramdaEquals(inputValue, predicateObject);
  }

  private static BiPredicate<Object, Object> predicate(String alias) {
    switch (alias) {
      case ">":
      case "$greaterThan":
        return (x, y) -> JsValues.toNumber(x) > JsValues.toNumber(y);
      case ">=":
      case "$greaterThanOrEqual":
        return (x, y) -> JsValues.toNumber(x) >= JsValues.toNumber(y);
      case "<":
      case "$lessThan":
        return (x, y) -> JsValues.toNumber(x) < JsValues.toNumber(y);
      case "<=":
      case "$lessThanOrEqual":
        return (x, y) -> JsValues.toNumber(x) <= JsValues.toNumber(y);
      case "===":
      case "$equal":
        return JsValues::ramdaEquals;
      case "!==":
      case "$notEqual":
        return (x, y) -> !JsValues.ramdaEquals(x, y);
      default:
        throw new SatpamException(alias + " is not a valid predicate");
    }
  }
}
