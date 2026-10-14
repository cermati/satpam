package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/some-member-of.js}. */
public final class SomeMemberOf extends BaseRule {
  public SomeMemberOf() {
    super("some-memberOf:$1", "<%= propertyName %> must be one of <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isUndefined(value)) {
      return false;
    }
    for (Object item : JsValues.asArray(value)) {
      if (JsValues.lodashIncludes(rule.param(0), item)) {
        return true;
      }
    }
    return false;
  }
}
