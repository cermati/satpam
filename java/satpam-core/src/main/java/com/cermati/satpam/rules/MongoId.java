package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/mongo-id.js}. */
public final class MongoId extends BaseRule {
  private static final JsRegex REGEX = JsRegex.compile("^[a-fA-F0-9]{24}$");

  public MongoId() {
    super("mongoId", "<%= propertyName %> field is not a valid Mongo ID.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    return REGEX.test(JsValues.toJsString(value));
  }
}
