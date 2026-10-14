package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import java.util.List;

/** Port of {@code src/validators/any-begin-with.js}. */
public final class AnyBeginWith extends BaseRule {

  /** {@code for...of} over the param: arrays and strings are iterable, anything else is a TypeError. */
  static List<Object> iterable(Object listLike) {
    if (!(listLike instanceof List) && !(listLike instanceof String)) {
      throw new IllegalArgumentException("TypeError: " + JsValues.toJsString(listLike) + " is not iterable");
    }
    return JsValues.iterate(listLike);
  }

  public AnyBeginWith() {
    super("anyBeginWith:$1", "At least one of <%= propertyName %> must begin with any of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value) || JsValues.ramdaIsEmpty(value)) {
      return false;
    }
    List<Object> prefixes = iterable(rule.param(0));
    for (Object item : JsValues.asArray(value)) {
      String itemAsString = JsValues.toJsString(item);
      for (Object prefix : prefixes) {
        if (itemAsString.startsWith(JsValues.toJsString(prefix))) {
          return true;
        }
      }
    }
    return false;
  }
}
