package com.cermati.satpam;

import java.util.Collections;
import java.util.Map;

/**
 * Result of a validation, mirrors the JS {@code { success, messages }}.
 *
 * <p>{@code messages} is keyed by property name, then by rule fullName, e.g.
 * {@code {"phone": {"numeric": "Phone must be a number."}}}. For nested rule mappings the value is
 * another messages map: {@code {"office": {"email": {"required": "Email field is required."}}}}.
 */
public final class ValidationResult {
  private final boolean success;
  private final Map<String, Object> messages;

  public ValidationResult(boolean success, Map<String, Object> messages) {
    this.success = success;
    this.messages = Collections.unmodifiableMap(messages);
  }

  public boolean isSuccess() {
    return success;
  }

  public Map<String, Object> getMessages() {
    return messages;
  }

  @Override
  public String toString() {
    return "ValidationResult{success=" + success + ", messages=" + messages + "}";
  }
}
