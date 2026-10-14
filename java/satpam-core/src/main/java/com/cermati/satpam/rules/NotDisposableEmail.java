package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.data.DisposableEmailDomains;
import com.cermati.satpam.internal.JsValues;

import java.util.List;
import java.util.Locale;

/** Port of {@code src/validators/not-disposable-email.js}. */
public final class NotDisposableEmail extends BaseRule {
  public NotDisposableEmail() {
    super("notDisposableEmail", "<%= propertyName %> domain not valid.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    if (JsValues.hasWhitespace(JsValues.toJsString(value))) {
      return false;
    }
    List<String> parts = JsValues.split(JsValues.requireString(value, "split"), "@");
    if (parts.size() != 2) {
      return false;
    }
    String domain = parts.get(1);
    if (domain.isEmpty()) {
      return false;
    }
    return !DisposableEmailDomains.contains(domain.toLowerCase(Locale.ROOT));
  }
}
