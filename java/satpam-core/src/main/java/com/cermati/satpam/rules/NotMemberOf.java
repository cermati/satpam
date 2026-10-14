package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/not-member-of.js}. */
public final class NotMemberOf extends BaseRule {
  public NotMemberOf() {
    super("not-memberOf:$1", "<%= propertyName %> must not be one of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    for (Object item : JsValues.asArray(value)) {
      // JS evaluates both sides of `!(is(String, item)) | list.indexOf(item) !== -1`
      boolean inList = JsValues.indexOfContains(rule.param(0), item);
      if (!JsValues.isString(item) || inList) {
        return false;
      }
    }
    return true;
  }
}
