package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

import java.util.List;
import java.util.Locale;

/** Port of {@code src/validators/not-equal-email-domain.js}. */
public final class NotEqualEmailDomain extends BaseRule {
  public NotEqualEmailDomain() {
    super("not-equal-email-domain:$1", "<%= propertyName %>'s domain is not valid.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    List<String> parts = JsValues.split(JsValues.requireString(value, "split"), "@");
    if (parts.size() != 2) {
      return false;
    }
    String domain = parts.get(1);
    if (domain.isEmpty()) {
      return false;
    }
    String lowerDomain = domain.toLowerCase(Locale.ROOT);

    // _.chain(params[0]).toLower().split(',').map(trim).compact()
    for (String prohibited : JsValues.split(JsValues.lodashToString(rule.param(0)).toLowerCase(Locale.ROOT), ",")) {
      String trimmed = JsValues.trim(prohibited);
      if (!trimmed.isEmpty() && trimmed.equals(lowerDomain)) {
        return false;
      }
    }
    return true;
  }
}
