package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/time-before-or-equal.js}. */
public final class TimeBeforeOrEqual extends ClockRule {
  public TimeBeforeOrEqual(Clock clock) {
    super("timeBeforeOrEqual:$1:$2:$3", clock, TimeComparison.message("<%= propertyName %> must be less than or equal to", clock));
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    TimeComparison c = new TimeComparison(env(), value, rule);
    return c.input.isSameOrBefore(c.target, com.cermati.satpam.Undefined.INSTANCE);
  }
}
