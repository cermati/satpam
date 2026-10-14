package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/time-after-or-equal.js}. */
public final class TimeAfterOrEqual extends ClockRule {
  public TimeAfterOrEqual(Clock clock) {
    super("timeAfterOrEqual:$1:$2:$3", clock, TimeComparison.message("<%= propertyName %> must be greater than or equal to", clock));
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    TimeComparison c = new TimeComparison(env(), value, rule);
    return c.input.isSameOrAfter(c.target, com.cermati.satpam.Undefined.INSTANCE);
  }
}
