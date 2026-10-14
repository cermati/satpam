package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/between.js}. */
public final class Between extends BaseRule {
  public Between() {
    super("between:$1:$2", "<%= propertyName %> must be greater than <%= ruleParams[0] %> and less than <%= ruleParams[1] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return false;
    }
    double number = JsValues.toNumber(value);
    if (Double.isNaN(number)) {
      return false;
    }
    return number > JsValues.toNumber(rule.param(0)) && number < JsValues.toNumber(rule.param(1));
  }
}
