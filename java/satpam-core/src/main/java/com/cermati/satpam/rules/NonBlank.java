package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/non-blank.js}. */
public final class NonBlank extends BaseRule {
  public NonBlank() {
    super("nonBlank", "<%= propertyName %> field must not be completely consists of white spaces.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    Object trimmed = JsValues.isString(value) ? JsValues.trim((String) value) : value;
    return Required.isPresent(trimmed);
  }
}
