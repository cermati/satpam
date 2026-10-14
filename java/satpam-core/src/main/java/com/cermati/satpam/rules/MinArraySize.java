package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/min-array-size.js}. */
public final class MinArraySize extends BaseRule {
  public MinArraySize() {
    super("minArraySize:$1", "<%= propertyName %> must have at least <%= ruleParams[0] %> item(s).");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    if (!JsValues.isArray(value)) {
      return false;
    }
    return JsValues.asList(value).size() >= JsValues.toNumber(rule.param(0));
  }
}
