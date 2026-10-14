package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/** Port of {@code src/validators/mobile-phone-number.js}. */
public final class MobilePhoneNumber extends BaseRule {
  private static final Pattern NORMALIZE = Pattern.compile("^(08|628|\\+628|8)");
  private static final JsRegex REGEX = JsRegex.compile("^(08|628|\\+628)[0-9]{8,12}$");
  private static final Set<String> PREFIXES = new HashSet<>(Arrays.asList(
    "0811", "0812", "0813", "0814", "0815", "0816", "0817", "0818", "0819", "0821",
    "0822", "0823", "0831", "0832", "0833", "0838", "0851", "0852", "0853", "0855",
    "0856", "0857", "0858", "0859", "0877", "0878", "0881", "0882", "0883", "0884",
    "0885", "0886", "0887", "0888", "0889", "0895", "0896", "0897", "0898", "0899"));

  public MobilePhoneNumber() {
    super("mobilePhoneNumber", "<%= propertyName %> field is not a valid mobile phone number.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    // lodash replace(value, /^(08|628|\+628|8)/, '08'), then substr(0, 4)
    String normalized = NORMALIZE.matcher(JsValues.lodashToString(value)).replaceFirst("08");
    String prefix = JsValues.substr(normalized, 0, 4);
    return PREFIXES.contains(prefix) && REGEX.test(JsValues.toJsString(value));
  }
}
