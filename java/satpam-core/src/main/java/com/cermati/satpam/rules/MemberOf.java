package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/member-of.js}. */
public final class MemberOf extends BaseRule {
  public MemberOf() {
    super("memberOf:$1", "<%= propertyName %> must be one of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    for (Object item : JsValues.asArray(value)) {
      if (!JsValues.indexOfContains(rule.param(0), item)) {
        return false;
      }
    }
    return true;
  }
}
