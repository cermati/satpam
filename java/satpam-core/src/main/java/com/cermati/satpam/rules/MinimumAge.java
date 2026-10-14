package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/minimum-age.js}. */
public final class MinimumAge extends ClockRule {
  public MinimumAge(Clock clock) {
    super("minimumAge:$1:$2", clock, "Minimum age is <%= ruleParams[0] %> years old.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    // is(Number, Number(x)) is always true, so the InvalidValidationRuleParameter branch never runs
    double minimumAge = JsValues.toNumber(rule.param(0));
    Moment today = Moment.now(env());
    Moment birthDate = Moment.create(env(), value, rule.param(1), false);
    double age = today.diff(birthDate, "years");
    return age > minimumAge - 1;
  }
}
