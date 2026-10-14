package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/min-length.js}. */
public final class MinLength extends BaseRule {
  public MinLength() {
    super("minLength:$1", "<%= propertyName %> must contain at least <%= ruleParams[0] %> character(s).");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    return JsValues.toJsString(value).length() >= JsValues.toNumber(rule.param(0));
  }
}
