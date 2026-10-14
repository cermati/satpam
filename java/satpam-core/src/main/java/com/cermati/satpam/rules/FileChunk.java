package com.cermati.satpam.rules;

import com.cermati.satpam.internal.JsValues;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * The first 12 bytes the file rules inspect: {@code buffer.slice(0, 12)} for a {@code byte[]} (a
 * Node {@code Buffer}), otherwise {@code readChunk.sync(path, 0, 12)} of a path string or of the
 * {@code path} property of an object.
 */
final class FileChunk {
  private static final int LENGTH = 12;

  private FileChunk() {
  }

  static byte[] read(Object value) {
    if (value instanceof byte[]) {
      byte[] bytes = (byte[]) value;
      return Arrays.copyOf(bytes, Math.min(bytes.length, LENGTH));
    }
    // R.is(Object, val) ? val.path : val
    Object path = value instanceof Map || value instanceof List ? JsValues.getProperty(value, "path") : value;
    String pathString;
    if (path instanceof String) {
      pathString = (String) path;
    } else if (path instanceof byte[]) {
      pathString = new String((byte[]) path, StandardCharsets.UTF_8);
    } else {
      throw new IllegalArgumentException(
        "TypeError [ERR_INVALID_ARG_TYPE]: The \"path\" argument must be of type string or an instance of Buffer or URL");
    }
    try (InputStream in = Files.newInputStream(Paths.get(pathString))) {
      byte[] buffer = new byte[LENGTH];
      int total = 0;
      int read;
      while (total < LENGTH && (read = in.read(buffer, total, LENGTH - total)) > 0) {
        total += read;
      }
      return Arrays.copyOf(buffer, total);
    } catch (IOException e) {
      throw new IllegalArgumentException("Cannot read file " + pathString + ": " + e, e);
    }
  }
}
