package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/equal.js}. */
public final class Equal extends BaseRule {
  public Equal() {
    super("equal:$1", "<%= propertyName %> must equal to <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return JsValues.strictEquals(value, rule.param(0));
  }
}
