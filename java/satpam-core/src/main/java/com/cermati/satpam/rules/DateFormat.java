package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/date-format.js}. */
public final class DateFormat extends ClockRule {
  public DateFormat(Clock clock) {
    super("dateFormat:$1", clock, "<%= propertyName %> must be in format <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    return Moment.create(env(), value, rule.param(0), true).isValid();
  }
}
