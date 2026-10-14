package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/date-time-before-or-equal.js}. */
public final class DateTimeBeforeOrEqual extends ClockRule {
  public DateTimeBeforeOrEqual(Clock clock) {
    super("dateTimeBeforeOrEqual:$1:$2:$3:$4", clock, DateComparison.message(
      "<%= propertyName %> must be less than or equal to <%= ruleParams[1] %>.",
      "<%= propertyName %> must be less than or equal to <%= ruleParams[1] %> minus <%= Math.abs(ruleParams[2]) %> <%= ruleParams[3] %>.",
      "<%= propertyName %> must be less than or equal to <%= ruleParams[1] %> plus <%= ruleParams[2] %> <%= ruleParams[3] %>."));
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    DateComparison c = new DateComparison(env(), value, rule, "seconds", "toLowerCase");
    return c.input.isSameOrBefore(c.target, c.unit);
  }
}
