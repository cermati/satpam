package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.IsoDuration;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/iso-8601-max-duration.js}. */
public final class Iso8601MaxDuration extends BaseRule {
  public Iso8601MaxDuration() {
    super("iso8601MaxDuration:$1", "<%= propertyName %> must be at most <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    Double duration = IsoDuration.toMillis(value);
    Double limit = IsoDuration.toMillis(rule.param(0));
    if (duration == null || limit == null) {
      return false;
    }
    return duration <= limit;
  }
}
