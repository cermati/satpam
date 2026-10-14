package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/** Port of {@code src/validators/indonesia-id-card-number-province.js}. */
public final class IndonesiaIdCardNumberProvince extends BaseRule {
  private static final Map<String, Integer> PROVINCE_CODES = new HashMap<>();

  static {
    PROVINCE_CODES.put("ACEH", 11);
    PROVINCE_CODES.put("SUMATERA UTARA", 12);
    PROVINCE_CODES.put("SUMATERA BARAT", 13);
    PROVINCE_CODES.put("RIAU", 14);
    PROVINCE_CODES.put("JAMBI", 15);
    PROVINCE_CODES.put("SUMATERA SELATAN", 16);
    PROVINCE_CODES.put("BENGKULU", 17);
    PROVINCE_CODES.put("LAMPUNG", 18);
    PROVINCE_CODES.put("KEPULAUAN BANGKA BELITUNG", 19);
    PROVINCE_CODES.put("KEPULAUAN RIAU", 21);
    PROVINCE_CODES.put("DKI JAKARTA", 31);
    PROVINCE_CODES.put("JAWA BARAT", 32);
    PROVINCE_CODES.put("JAWA TENGAH", 33);
    PROVINCE_CODES.put("DI YOGYAKARTA", 34);
    PROVINCE_CODES.put("JAWA TIMUR", 35);
    PROVINCE_CODES.put("BANTEN", 36);
    PROVINCE_CODES.put("BALI", 51);
    PROVINCE_CODES.put("NUSA TENGGARA BARAT", 52);
    PROVINCE_CODES.put("NUSA TENGGARA TIMUR", 53);
    PROVINCE_CODES.put("KALIMANTAN BARAT", 61);
    PROVINCE_CODES.put("KALIMANTAN TENGAH", 62);
    PROVINCE_CODES.put("KALIMANTAN SELATAN", 63);
    PROVINCE_CODES.put("KALIMANTAN TIMUR", 64);
    PROVINCE_CODES.put("KALIMANTAN UTARA", 65);
    PROVINCE_CODES.put("SULAWESI UTARA", 71);
    PROVINCE_CODES.put("SULAWESI TENGAH", 72);
    PROVINCE_CODES.put("SULAWESI SELATAN", 73);
    PROVINCE_CODES.put("SULAWESI TENGGARA", 74);
    PROVINCE_CODES.put("GORONTALO", 75);
    PROVINCE_CODES.put("SULAWESI BARAT", 76);
    PROVINCE_CODES.put("MALUKU", 81);
    PROVINCE_CODES.put("MALUKU UTARA", 82);
    PROVINCE_CODES.put("PAPUA", 91);
    PROVINCE_CODES.put("PAPUA BARAT", 92);
  }

  public IndonesiaIdCardNumberProvince() {
    super("indonesiaIdCardNumberProvince:$1", "<%= propertyName %> province code does not match province input.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    double provinceCode = JsValues.toNumber(JsValues.substr(JsValues.toJsString(value), 0, 2));
    Object provinceInputValue = JsValues.getProperty(inputObj, rule.param(0));
    if (!JsValues.truthy(provinceInputValue)) {
      return false;
    }
    Integer expected = PROVINCE_CODES.get(JsValues.requireString(provinceInputValue, "toUpperCase").toUpperCase(Locale.ROOT));
    return expected != null && provinceCode == expected;
  }
}
