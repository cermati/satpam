package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.IsoDuration;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/iso-8601-duration.js}. */
public final class Iso8601Duration extends BaseRule {
  public Iso8601Duration() {
    super("iso8601Duration", "<%= propertyName %> must be a valid ISO 8601 duration.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    return IsoDuration.toMillis(value) != null;
  }
}
