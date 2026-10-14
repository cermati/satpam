package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/date-after.js}. */
public final class DateAfter extends ClockRule {
  public DateAfter(Clock clock) {
    super("dateAfter:$1:$2:$3:$4", clock, DateComparison.message(
      "<%= propertyName %> must greater than <%= ruleParams[1] %>.",
      "<%= propertyName %> must greater than <%= ruleParams[1] %> minus <%= Math.abs(ruleParams[2]) %> <%= ruleParams[3] %>.",
      "<%= propertyName %> must greater than <%= ruleParams[1] %> plus <%= ruleParams[2] %> <%= ruleParams[3] %>."));
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    DateComparison c = new DateComparison(env(), value, rule, "days", "toLowerCase");
    return c.input.isAfter(c.target, "day");
  }
}
