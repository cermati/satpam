package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.FileTypes;
import com.cermati.satpam.internal.JsValues;

/**
 * Port of {@code src/validators/image.js}: image-type 4.1.0 (file-type 10.11.0) must recognize the
 * first 12 bytes as an image. The value is a {@code byte[]}, a file path, or an object with a
 * {@code path}.
 */
public final class ImageRule extends BaseRule {
  public ImageRule() {
    super("image", "<%= propertyName %> must be an image.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    String ext = FileTypes.detectV10(FileChunk.read(value));
    return ext != null && FileTypes.IMAGE_EXTENSIONS.contains(ext);
  }
}
