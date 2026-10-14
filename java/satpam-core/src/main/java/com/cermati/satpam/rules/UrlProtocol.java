package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.WhatwgUrl;

/** Port of {@code src/validators/url-protocol.js}. */
public final class UrlProtocol extends BaseRule {
  public UrlProtocol() {
    super("urlProtocol:$1", "<%= propertyName %> does not have a valid url protocol. It must be '<%= ruleParams[0] %>'.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    // new URL(val) throws (-> false) when val does not parse as an absolute URL
    String scheme = WhatwgUrl.parseScheme(JsValues.toJsString(value));
    return scheme != null && JsValues.strictEquals(scheme, rule.param(0));
  }
}
