package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/contains-lower-case.js}. */
public final class ContainsLowerCase extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("[a-z]{1,}", "");

  public ContainsLowerCase() {
    super("containsLowerCase", "<%= propertyName %> must contain at least 1 lower case character.");
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
