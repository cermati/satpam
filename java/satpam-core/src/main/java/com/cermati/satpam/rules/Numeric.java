package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/numeric.js}. */
public final class Numeric extends BaseRule {
  public Numeric() {
    super("numeric", "<%= propertyName %> must be a number.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.truthy(value)) {
      return !Double.isNaN(JsValues.toNumber(value));
    }
    return true;
  }
}
