package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/plain-object.js}. */
public final class PlainObject extends BaseRule {
  public PlainObject() {
    super("plainObject", "<%= propertyName %> is not a plain object.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return JsValues.isNil(value) || JsValues.isPlainObject(value);
  }
}
