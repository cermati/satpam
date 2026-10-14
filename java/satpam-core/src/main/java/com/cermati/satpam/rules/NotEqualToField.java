package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/not-equal-to-field.js}. */
public final class NotEqualToField extends BaseRule {
  public NotEqualToField() {
    super("not-equal-to-field:$1", "<%= propertyName %> must not equal to <%= inputObj[ruleParams[0]] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return !JsValues.strictEquals(value, JsValues.getProperty(inputObj, rule.param(0)));
  }
}
