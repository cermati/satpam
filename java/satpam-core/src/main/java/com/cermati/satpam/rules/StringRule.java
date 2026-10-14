package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/string.js}. */
public final class StringRule extends BaseRule {
  public StringRule() {
    super("string", "<%= propertyName %> is not a string.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return JsValues.isNil(value) || JsValues.isString(value);
  }
}
