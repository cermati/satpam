package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/pattern.js}. */
public final class PatternRule extends BaseRule {
  public PatternRule() {
    super("pattern:$1:$2", "<%= propertyName %> does not conform pattern <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    if (!JsValues.isString(value)) {
      return false;
    }
    Object pattern = rule.param(0);
    Object flags = rule.param(1);
    String source = JsValues.isUndefined(pattern) ? "(?:)" : JsValues.toJsString(pattern);
    return JsRegex.compile(source, JsValues.isUndefined(flags) ? "" : JsValues.toJsString(flags)).test((String) value);
  }
}
