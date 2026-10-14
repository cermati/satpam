package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/** Port of {@code src/validators/indonesia-id-card-number-birth-date.js}. */
public final class IndonesiaIdCardNumberBirthDate extends ClockRule {
  public IndonesiaIdCardNumberBirthDate(Clock clock) {
    super("indonesiaIdCardNumberBirthDate:$1:$2", clock, "<%= propertyName %> birth date number sequence does not match the given birth date.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    // Birth date (DDMMYY) starts at the 7th digit; Indonesian ID cards add 40 to the day for women
    String idCard = JsValues.toJsString(value);
    double birthDate = JsValues.toNumber(JsValues.substr(idCard, 6, 2));
    if (birthDate > 40) {
      birthDate = birthDate - 40;
    }
    String birthDateFromIdCard = birthDate < 10 ? "0" + JsValues.numberToString(birthDate) : JsValues.numberToString(birthDate);
    String monthAndYearFromIdCard = JsValues.substr(idCard, 8, 4);

    Object birthDateInput = JsValues.getProperty(inputObj, rule.param(0));
    String birthDateValue = Moment.create(env(), birthDateInput, rule.param(1), false).format("DDMMYY");
    return birthDateValue.equals(birthDateFromIdCard + monthAndYearFromIdCard);
  }
}
