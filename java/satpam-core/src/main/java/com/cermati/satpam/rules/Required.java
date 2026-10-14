package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/required.js}. */
public final class Required extends BaseRule {

  /** {@code !(val === undefined || val === null || val === '')}, shared with the requiredIf rules. */
  public static boolean isPresent(Object value) {
    return !(JsValues.isNil(value) || "".equals(value));
  }

  public Required() {
    super("required", "<%= propertyName %> field is required.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return isPresent(value);
  }
}
