package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import java.util.Collections;
import java.util.List;

/** Port of {@code src/validators/must-have-all-prefixes.js}. */
public final class MustHaveAllPrefixes extends BaseRule {

  /** ramda {@code startsWith(prefix, item)}: {@code equals(take(prefix.length, item), prefix)}. */
  private static boolean ramdaStartsWith(Object prefix, Object item) {
    if (JsValues.isNil(item)) {
      throw new IllegalArgumentException("TypeError: Cannot read properties of " + JsValues.toJsString(item) + " (reading 'take')");
    }
    if (prefix instanceof String) {
      return item instanceof String && ((String) item).startsWith((String) prefix);
    }
    if (prefix instanceof List) {
      List<Object> prefixList = JsValues.asList(prefix);
      if (item instanceof String) {
        return false;
      }
      // Array.prototype.slice on a non-array value gives []
      List<Object> itemList = item instanceof List ? JsValues.asList(item) : Collections.emptyList();
      List<Object> taken = itemList.subList(0, Math.min(prefixList.size(), itemList.size()));
      return JsValues.ramdaEquals(taken, prefixList);
    }
    return false;
  }

  public MustHaveAllPrefixes() {
    super("mustHaveAllPrefixes:$1", "<%= propertyName %> must have all prefixes of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.ramdaIsEmpty(value) || JsValues.isNil(value)) {
      return false;
    }
    List<Object> values = JsValues.asArray(value);
    for (Object prefix : JsValues.iterate(rule.param(0))) {
      boolean found = false;
      for (Object item : values) {
        if (ramdaStartsWith(prefix, item)) {
          found = true;
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
    return true;
  }
}
