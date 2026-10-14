package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/contains-alphabet.js}. */
public final class ContainsAlphabet extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("[a-zA-Z]{1,}", "");

  public ContainsAlphabet() {
    super("containsAlphabet", "<%= propertyName %> must contain at least 1 alphabet.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    if (!JsValues.isString(value)) {
      return false;
    }
    return REGEX.test((String) value);
  }
}
