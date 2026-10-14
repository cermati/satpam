package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/length.js}. */
public final class Length extends BaseRule {
  public Length() {
    super("length:$1", "<%= propertyName %> must have length of <%= ruleParams[0] %> character(s).");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    return JsValues.toJsString(value).length() == JsValues.toNumber(rule.param(0));
  }
}
