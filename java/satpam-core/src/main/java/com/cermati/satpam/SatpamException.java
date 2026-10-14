package com.cermati.satpam;

/**
 * Thrown where JavaScript satpam would throw, e.g. an unknown rule name or a missing locale.
 */
public class SatpamException extends RuntimeException {
  public SatpamException(String message) {
    super(message);
  }

  public SatpamException(String message, Throwable cause) {
    super(message, cause);
  }
}
