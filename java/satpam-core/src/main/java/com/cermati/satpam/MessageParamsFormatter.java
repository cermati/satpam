package com.cermati.satpam;

import java.util.List;

/**
 * Mirrors the JS {@code options.validationMessageParamsFormatter}: lets callers reformat the rule
 * params and property name that are rendered into the message.
 */
@FunctionalInterface
public interface MessageParamsFormatter {
  FormattedParams format(String propertyName, Object propertyValue, Object inputObj, RuleObject violatedRule);

  final class FormattedParams {
    private final List<Object> ruleParams;
    private final String propertyName;

    /**
     * @param ruleParams must have the same size as the violated rule's params
     * @param propertyName display name; {@code null} falls back to lodash {@code startCase(propertyName)}
     */
    public FormattedParams(List<Object> ruleParams, String propertyName) {
      this.ruleParams = ruleParams;
      this.propertyName = propertyName;
    }

    public List<Object> getRuleParams() {
      return ruleParams;
    }

    public String getPropertyName() {
      return propertyName;
    }
  }
}
