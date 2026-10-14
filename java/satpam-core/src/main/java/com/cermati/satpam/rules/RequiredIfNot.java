package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.Noes;

/** Port of {@code src/validators/required-if-not.js}. */
public final class RequiredIfNot extends BaseRule {
  public RequiredIfNot() {
    super("requiredIfNot:$1:$2", "<%= propertyName %> field is required.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    Object target = rule.param(0);
    if (Noes.shouldCreateConjunction(target) && !Noes.satisfied(target, inputObj)) {
      return Required.isPresent(value);
    }
    if (!JsValues.isNil(rule.param(1))
      && !JsValues.strictEquals(JsValues.getProperty(inputObj, target), rule.param(1))) {
      return Required.isPresent(value);
    }
    return true;
  }
}
