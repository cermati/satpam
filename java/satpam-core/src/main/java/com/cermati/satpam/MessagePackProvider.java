package com.cermati.satpam;

import java.util.Map;

/**
 * Mirrors the JS {@code options.validationMessagePackProvider}: returns messages keyed by rule
 * fullName. Missing (or empty) entries fall back to the validator's own messages.
 */
@FunctionalInterface
public interface MessagePackProvider {
  Map<String, Message> provide(String propertyName, Object inputObj, RuleObject violatedRule);
}
