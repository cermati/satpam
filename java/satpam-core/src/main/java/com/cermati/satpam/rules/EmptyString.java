package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;

/** Port of {@code src/validators/empty-string.js}. */
public final class EmptyString extends BaseRule {
  public EmptyString() {
    super("emptyString", "<%= propertyName %> field must be an empty string.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    return "".equals(value);
  }
}
