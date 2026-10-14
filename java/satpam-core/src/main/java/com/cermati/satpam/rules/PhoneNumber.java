package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/phone-number.js}. */
public final class PhoneNumber extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("^(0|62|\\+62)[0-9]{6,15}$");

  public PhoneNumber() {
    super("phoneNumber", "<%= propertyName %> field is not a valid phone number.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    return REGEX.test(JsValues.toJsString(value));
  }
}
