package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/date.js}. */
public final class DateRule extends ClockRule {
  public DateRule(Clock clock) {
    super("date", clock, "<%= propertyName %> is not a valid date.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.truthy(value)) {
      return Moment.create(env(), value, com.cermati.satpam.Undefined.INSTANCE, false).isValid();
    }
    return true;
  }
}
