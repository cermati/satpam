package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/max-value.js}. */
public final class MaxValue extends BaseRule {
  public MaxValue() {
    super("maxValue:$1", "<%= propertyName %> must be less than or equal to <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    double number = JsValues.toNumber(value);
    if (Double.isNaN(number)) {
      return false;
    }
    return number <= JsValues.toNumber(rule.param(0));
  }
}
