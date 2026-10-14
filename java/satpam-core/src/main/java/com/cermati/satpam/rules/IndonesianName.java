package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/indonesian-name.js}. */
public final class IndonesianName extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("^[a-zA-Z][a-zA-Z\\.\\-\\'\\,/\\s]*$");

  public IndonesianName() {
    super("indonesianName", "<%= propertyName %> is not a valid name.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    return REGEX.test(JsValues.toJsString(value));
  }
}
