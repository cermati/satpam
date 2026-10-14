package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/alphanumeric.js}. */
public final class Alphanumeric extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("^[0-9A-Z]+$", "i");

  public Alphanumeric() {
    super("alphanumeric", "<%= propertyName %> may only contain letters and numbers.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.truthy(value)) {
      return REGEX.test(JsValues.toJsString(value));
    }
    return true;
  }
}
