package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/array.js}. */
public final class ArrayRule extends BaseRule {
  public ArrayRule() {
    super("array", "<%= propertyName %> is not an array.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return JsValues.isNil(value) || JsValues.isArray(value);
  }
}
