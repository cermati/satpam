package com.cermati.satpam;

/**
 * Validation function, mirrors the JS {@code validate(val, ruleObj, propertyName, inputObj)}.
 *
 * <p>Values follow JavaScript semantics: numbers are {@link Double}, objects are
 * {@code Map<String, Object>}, arrays are {@code List<Object>}, and a missing property is
 * {@link Undefined#INSTANCE}. {@code inputObj} is the object that holds the property (the nested
 * object for nested rule mappings, not the root input).
 */
@FunctionalInterface
public interface RuleFunction {
  boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj);
}
