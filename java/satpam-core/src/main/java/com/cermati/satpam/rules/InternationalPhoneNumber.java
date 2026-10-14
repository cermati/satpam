package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/** Port of {@code src/validators/international-phone-number.js}. */
public final class InternationalPhoneNumber extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("^\\+?[0-9]{2,15}$");
  private static final Set<String> ONE_DIGIT_PREFIXES = new HashSet<>(Arrays.asList(
    "1", "7"));
  private static final Set<String> TWO_DIGIT_PREFIXES = new HashSet<>(Arrays.asList(
    "20", "27", "30", "31", "32", "33", "34", "36", "39", "40",
    "41", "43", "44", "45", "46", "47", "48", "49", "51", "52",
    "53", "54", "55", "56", "57", "58", "60", "61", "62", "63",
    "64", "65", "66", "81", "82", "84", "86", "90", "91", "92",
    "93", "94", "95", "98"));
  private static final Set<String> THREE_DIGIT_PREFIXES = new HashSet<>(Arrays.asList(
    "211", "212", "213", "216", "218", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229",
    "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244",
    "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "260",
    "261", "262", "263", "264", "265", "266", "267", "268", "269", "290", "291", "297", "298", "299", "350",
    "351", "352", "353", "354", "355", "356", "357", "358", "359", "370", "371", "372", "373", "374", "375",
    "376", "377", "378", "379", "380", "381", "382", "385", "386", "387", "388", "389", "420", "421", "423",
    "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "590", "591", "592", "593", "594",
    "595", "596", "597", "598", "599", "670", "672", "673", "674", "675", "676", "677", "678", "679", "680",
    "681", "682", "683", "685", "686", "687", "688", "689", "690", "691", "692", "800", "808", "850", "852",
    "853", "855", "856", "870", "878", "880", "881", "882", "883", "886", "888", "960", "961", "962", "963",
    "964", "965", "966", "967", "968", "970", "971", "972", "973", "974", "975", "976", "977", "979", "991",
    "992", "993", "994", "995", "996", "998"));

  public InternationalPhoneNumber() {
    super("internationalPhoneNumber", "<%= propertyName %> field is not a valid international phone number.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    String valStr = JsValues.toJsString(value);
    if (!REGEX.test(valStr)) {
      return false;
    }
    String digits = valStr.startsWith("+") ? valStr.substring(1) : valStr;
    return ONE_DIGIT_PREFIXES.contains(JsValues.substr(digits, 0, 1))
      || TWO_DIGIT_PREFIXES.contains(JsValues.substr(digits, 0, 2))
      || THREE_DIGIT_PREFIXES.contains(JsValues.substr(digits, 0, 3));
  }
}
