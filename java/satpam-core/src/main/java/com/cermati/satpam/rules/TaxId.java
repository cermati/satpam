package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/tax-id.js}. */
public final class TaxId extends BaseRule {
  /** NPWP check digit, see http://excelku.com/2014/12/06/rumus-excel-menguji-validitas-npwp */
  private static boolean isIndonesianTaxId(String value) {
    if (value.length() != 15) {
      return false;
    }
    int total = 0;
    for (int index = 0; index < 8; index++) {
      // any(isNaN): isNaN(' ') is false, so whitespace counts as the digit 0
      double x = JsValues.toNumber(String.valueOf(value.charAt(index)));
      if (Double.isNaN(x)) {
        return false;
      }
      int digit = (int) x;
      int y = (index + 1) % 2 == 0 ? digit * 2 : digit;
      total += y / 10 + y % 10;
    }
    double ninthDigit = JsValues.toNumber(String.valueOf(value.charAt(8)));
    int roundedToNearestTen = (int) Math.ceil(total / 10.0) * 10;
    return roundedToNearestTen - total == ninthDigit;
  }

  public TaxId() {
    super("taxId:$1", "<%= propertyName %> is not a valid tax identification number.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    Object strategy = rule.param(0);
    String stringValue = JsValues.toJsString(value);
    if ("id".equals(strategy)) {
      return isIndonesianTaxId(stringValue);
    }
    throw new IllegalArgumentException("Could not found tax id validation strategy for the given strategy: %s");
  }
}
