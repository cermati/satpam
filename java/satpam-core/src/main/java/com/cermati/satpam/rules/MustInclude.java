package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import java.util.List;

/** Port of {@code src/validators/must-include.js}. */
public final class MustInclude extends BaseRule {
  public MustInclude() {
    super("mustInclude:$1", "<%= propertyName %> must include all of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.ramdaIsEmpty(value) || JsValues.isNil(value)) {
      return true;
    }
    List<Object> values = JsValues.asArray(value);
    for (Object required : JsValues.iterate(rule.param(0))) {
      boolean found = false;
      for (Object item : values) {
        if (JsValues.sameValueZero(item, required)) {
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
