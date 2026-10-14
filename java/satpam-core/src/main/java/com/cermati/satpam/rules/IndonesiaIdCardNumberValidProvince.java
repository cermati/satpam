package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/** Port of {@code src/validators/indonesia-id-card-number-valid-province.js}. */
public final class IndonesiaIdCardNumberValidProvince extends BaseRule {
  private static final Set<Integer> VALID_CODES = new HashSet<>(Arrays.asList(
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 31, 32, 33, 34, 35, 36, 51, 52, 53, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 76, 81, 82, 91, 92, 93, 94, 95, 96));

  public IndonesiaIdCardNumberValidProvince() {
    super("indonesiaIdCardNumberValidProvince", "<%= propertyName %> province code is not valid.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    double provinceCode = JsValues.toNumber(JsValues.substr(JsValues.toJsString(value), 0, 2));
    return provinceCode == Math.rint(provinceCode) && VALID_CODES.contains((int) provinceCode);
  }
}
