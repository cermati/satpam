package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import java.util.List;

/** Port of {@code src/validators/begin-with.js}. */
public final class BeginWith extends BaseRule {

  /** ramda 0.25 {@code indexOf(prefix, str) === 0}: native String indexOf, so the prefix is coerced to string. */
  private static boolean beginsWith(String item, Object prefix) {
    return item.startsWith(JsValues.toJsString(prefix));
  }

  public BeginWith() {
    super("beginWith:$1", "<%= propertyName %> must begin with one of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return false;
    }
    List<Object> prefixes = JsValues.iterate(rule.param(0));
    for (Object item : JsValues.asArray(value)) {
      if (JsValues.isNil(item)) {
        throw new IllegalArgumentException("TypeError: Cannot read properties of " + JsValues.toJsString(item) + " (reading 'toString')");
      }
      String itemAsString = JsValues.toJsString(item);
      boolean matched = false;
      for (Object prefix : prefixes) {
        if (beginsWith(itemAsString, prefix)) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        return false;
      }
    }
    return true;
  }
}
