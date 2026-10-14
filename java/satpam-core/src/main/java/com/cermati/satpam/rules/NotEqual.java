package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/not-equal.js}. */
public final class NotEqual extends BaseRule {
  public NotEqual() {
    super("not-equal:$1", "<%= propertyName %> must not equal to <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return !JsValues.strictEquals(value, rule.param(0));
  }
}
