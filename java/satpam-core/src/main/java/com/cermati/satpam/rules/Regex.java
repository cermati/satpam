package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/regex.js}. */
public final class Regex extends BaseRule {
  public Regex() {
    super("regex", "<%= propertyName %> is not a valid regex string.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    try {
      JsRegex.compile(JsValues.toJsString(value));
      return true;
    } catch (IllegalArgumentException e) {
      return false;
    }
  }
}
