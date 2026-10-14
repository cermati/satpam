package com.cermati.satpam;

/**
 * Produces the message template for a violated rule, mirrors a JS satpam message that is either a
 * template string or a {@code (ruleObj, propertyName, value) => string} function.
 *
 * <p>The returned template is rendered like a lodash template: {@code <%= expr %>},
 * {@code <%- expr %>} and {@code ${expr}} with {@code propertyName}, {@code ruleName},
 * {@code ruleParams}, {@code value} and {@code inputObj} in scope.
 */
@FunctionalInterface
public interface Message {
  String template(RuleObject rule, String propertyName, Object value);

  static Message of(String template) {
    return new Template(template);
  }

  /** A fixed template string, the JS string-message case. */
  final class Template implements Message {
    private final String template;

    private Template(String template) {
      this.template = template;
    }

    @Override
    public String template(RuleObject rule, String propertyName, Object value) {
      return template;
    }

    /** JS falsiness of the message value: an empty template string falls back to the default message. */
    public boolean isEmpty() {
      return template == null || template.isEmpty();
    }

    @Override
    public String toString() {
      return template;
    }
  }
}
