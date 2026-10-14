package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.Undefined;
import com.cermati.satpam.internal.FileTypes;
import com.cermati.satpam.internal.JsValues;

/**
 * Port of {@code src/validators/file-type.js}: the extension detected by file-type 3.8.0 from the
 * first 12 bytes must equal the param. The value is a {@code byte[]}, a file path, or an object
 * with a {@code path}.
 */
public final class FileType extends BaseRule {
  public FileType() {
    super("fileType:$1", "<%= propertyName %> must be a(n) <%= ruleParams[0] %>.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    String ext = FileTypes.detectV3(FileChunk.read(value));
    return JsValues.strictEquals(ext == null ? Undefined.INSTANCE : ext, rule.param(0));
  }
}
