package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/credit-card.js}. */
public final class CreditCard extends BaseRule {
  public CreditCard() {
    super("creditCard", "<%= propertyName %> is not a valid credit card number.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    String str = JsValues.requireString(value, "replace");
    StringBuilder sanitized = new StringBuilder();
    for (int i = 0; i < str.length(); i++) {
      if (str.charAt(i) >= '0' && str.charAt(i) <= '9') {
        sanitized.append(str.charAt(i));
      }
    }
    int sum = 0;
    boolean shouldDouble = false;
    for (int i = sanitized.length() - 1; i >= 0; i--) {
      int tmpNum = sanitized.charAt(i) - '0';
      if (shouldDouble) {
        tmpNum *= 2;
        sum += tmpNum >= 10 ? (tmpNum % 10) + 1 : tmpNum;
      } else {
        sum += tmpNum;
      }
      shouldDouble = !shouldDouble;
    }
    // !!(sum % 10 === 0 ? sanitized : false)
    return sum % 10 == 0 && sanitized.length() > 0;
  }
}
