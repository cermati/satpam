package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/max-array-size.js}. */
public final class MaxArraySize extends BaseRule {
  public MaxArraySize() {
    super("maxArraySize:$1", "<%= propertyName %> must have at most <%= ruleParams[0] %> item(s).");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    if (!JsValues.isArray(value)) {
      return false;
    }
    return JsValues.asList(value).size() <= JsValues.toNumber(rule.param(0));
  }
}
