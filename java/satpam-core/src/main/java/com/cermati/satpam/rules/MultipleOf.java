package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/multiple-of.js}. */
public final class MultipleOf extends BaseRule {
  public MultipleOf() {
    super("multipleOf:$1", "<%= propertyName %> must be a multiple of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return JsValues.toNumber(value) % JsValues.toNumber(rule.param(0)) == 0;
  }
}
