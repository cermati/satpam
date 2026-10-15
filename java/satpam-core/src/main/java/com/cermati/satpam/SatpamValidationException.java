package com.cermati.satpam;

/**
 * Thrown by {@link SatpamValidator#validateOrThrow} and {@link SatpamValidator#validateBeanOrThrow}
 * when the input fails validation. {@link #getResult()} is the failed {@link ValidationResult}, so a
 * web layer can turn it into a {@code {"success": false, "messages": {...}}} response.
 *
 * <p>Not a {@link SatpamException}: that one means the rules themselves are wrong (an unknown rule,
 * bad params), which is a bug rather than bad input, and should not be answered the same way.
 */
public class SatpamValidationException extends RuntimeException {
  private final transient ValidationResult result;

  public SatpamValidationException(ValidationResult result) {
    // Property names only: messages can contain input values, which should not end up in logs
    super("Validation failed for " + result.getMessages().keySet());
    this.result = result;
  }

  public ValidationResult getResult() {
    return result;
  }
}
