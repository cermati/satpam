package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

/** Port of {@code src/validators/non-blank-items.js}. */
public final class NonBlankItems extends BaseRule {
  public NonBlankItems() {
    super("nonBlankItems", "<%= propertyName %> must not contain blank item(s).");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (JsValues.isNil(value)) {
      return true;
    }
    if (!JsValues.isArray(value)) {
      return false;
    }
    for (Object item : JsValues.asList(value)) {
      if (JsValues.isString(item) && JsValues.trim((String) item).isEmpty()) {
        return false;
      }
    }
    return true;
  }
}
