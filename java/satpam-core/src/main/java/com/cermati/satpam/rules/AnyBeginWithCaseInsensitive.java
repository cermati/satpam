package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/** Port of {@code src/validators/any-begin-with-case-insensitive.js}. */
public final class AnyBeginWithCaseInsensitive extends BaseRule {

  private static String sanitize(Object input) {
    return JsValues.trim(JsValues.toJsString(input).toLowerCase(Locale.ROOT));
  }

  public AnyBeginWithCaseInsensitive() {
    super("anyBeginWithCaseInsensitive:$1", "At least one of <%= propertyName %> must begin with any of <%= ruleParams[0] %> while ignoring whitespaces and case.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value) || JsValues.ramdaIsEmpty(value)) {
      return false;
    }
    Object param = rule.param(0);
    if (!(param instanceof List)) {
      throw new IllegalArgumentException("TypeError: ruleObj.params[0].map is not a function");
    }
    List<String> prefixes = new ArrayList<>();
    for (Object prefix : JsValues.asList(param)) {
      prefixes.add(sanitize(prefix));
    }
    for (Object item : JsValues.asArray(value)) {
      String itemAsString = sanitize(item);
      for (String prefix : prefixes) {
        if (itemAsString.startsWith(prefix)) {
          return true;
        }
      }
    }
    return false;
  }
}
