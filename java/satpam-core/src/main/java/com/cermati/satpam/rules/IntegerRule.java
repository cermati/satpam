package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/integer.js}. */
public final class IntegerRule extends BaseRule {
  public IntegerRule() {
    super("integer", "<%= propertyName %> must be an integer.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    double number = JsValues.toNumber(value);
    if (JsValues.toJsString(value).isEmpty() || Double.isNaN(number)) {
      return false;
    }
    return !Double.isInfinite(number) && Math.floor(number) == number;
  }
}
