package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/imei.js}. */
public final class Imei extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("^[0-9]{15}$");

  public Imei() {
    super("imei", "<%= propertyName %> is not a valid IMEI.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    if (!REGEX.test(JsValues.toJsString(value))) {
      return false;
    }
    String str = JsValues.requireString(value, "charAt");
    int sum = 0;
    int factor = 2;
    for (int i = 13; i >= 0; i--) {
      int multipliedDigit = (str.charAt(i) - '0') * factor;
      sum += multipliedDigit >= 10 ? (multipliedDigit % 10) + 1 : multipliedDigit;
      factor = factor == 1 ? 2 : 1;
    }
    int checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit == str.charAt(14) - '0';
  }
}
