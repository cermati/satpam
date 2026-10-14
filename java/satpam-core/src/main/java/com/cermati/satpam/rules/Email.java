package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

import java.util.List;
import java.util.Locale;

/** Port of {@code src/validators/email.js}. */
public final class Email extends BaseRule {
  private static final JsRegex USER_REGEX = JsRegex.compile(
    "^((([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))$",
    "i");

  public Email() {
    super("email", "<%= propertyName %> must be email.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value) || "".equals(value)) {
      return true;
    } else if (!JsValues.isString(value) || JsValues.hasWhitespace((String) value)) {
      return false;
    }

    List<String> parts = JsValues.split((String) value, "@");
    String domain = parts.remove(parts.size() - 1);
    String user = String.join("@", parts);

    String lowerDomain = domain.toLowerCase(Locale.ROOT);
    if (lowerDomain.equals("gmail.com") || lowerDomain.equals("googlemail.com")) {
      // user.replace(/\.(?!$)/g, ''): drop every dot except a final one
      boolean trailingDot = user.endsWith(".");
      user = user.replace(".", "") + (trailingDot ? "." : "");
      user = user.toLowerCase(Locale.ROOT);
    }
    if (domain.isEmpty() || !Fqdn.isFqdn(domain)) {
      return false;
    }

    return USER_REGEX.test(user);
  }
}
