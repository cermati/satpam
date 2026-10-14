package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

import java.util.HashMap;
import java.util.Map;

/** Port of {@code src/validators/uuid.js}. */
public final class Uuid extends BaseRule {
  private static final Map<String, JsRegex> VERSIONS = new HashMap<>();

  static {
    VERSIONS.put("v1", JsRegex.compile("^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$", "i"));
    VERSIONS.put("v3", JsRegex.compile("^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$", "i"));
    VERSIONS.put("v4", JsRegex.compile("^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$", "i"));
    VERSIONS.put("v5", JsRegex.compile("^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$", "i"));
    VERSIONS.put("all", JsRegex.compile("^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$", "i"));
  }

  public Uuid() {
    super("uuid:$1", "<%= propertyName %> field is not a valid UUID.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    Object version = rule.param(0);
    JsRegex regex = VERSIONS.get(JsValues.truthy(version) ? JsValues.toJsString(version) : "all");
    if (regex == null) {
      throw new IllegalArgumentException("TypeError: Cannot read properties of undefined (reading 'test')");
    }
    return regex.test(JsValues.toJsString(value));
  }
}
