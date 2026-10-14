package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/alpha.js}. */
public final class Alpha extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("^[A-Z ]+$", "i");

  public Alpha() {
    super("alpha", "<%= propertyName %> may only contain letters.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.truthy(value)) {
      return REGEX.test(JsValues.toJsString(value));
    }
    return true;
  }
}
