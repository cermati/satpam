package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/indonesia-id-card-number-gender.js}. */
public final class IndonesiaIdCardNumberGender extends BaseRule {
  public IndonesiaIdCardNumberGender() {
    super("indonesiaIdCardNumberGender:$1:$2:$3", "<%= propertyName %> gender code does not match gender input.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    // Indonesian ID cards add 40 to the birth date of women
    double birthDate = JsValues.toNumber(JsValues.substr(JsValues.toJsString(value), 6, 2));
    Object genderInputValue = JsValues.getProperty(inputObj, rule.param(0));
    return JsValues.strictEquals(genderInputValue, birthDate > 40 ? rule.param(1) : rule.param(2));
  }
}
