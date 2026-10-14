package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/time-after.js}. */
public final class TimeAfter extends ClockRule {
  public TimeAfter(Clock clock) {
    super("timeAfter:$1:$2:$3", clock, TimeComparison.message("<%= propertyName %> must be greater than", clock));
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    TimeComparison c = new TimeComparison(env(), value, rule);
    return c.input.isAfter(c.target, com.cermati.satpam.Undefined.INSTANCE);
  }
}
