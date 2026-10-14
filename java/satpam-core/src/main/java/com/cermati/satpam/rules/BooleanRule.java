package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/boolean.js}. */
public final class BooleanRule extends BaseRule {
  public BooleanRule() {
    super("boolean", "<%= propertyName %> must be a boolean.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return value instanceof Boolean || JsValues.isUndefined(value);
  }
}
