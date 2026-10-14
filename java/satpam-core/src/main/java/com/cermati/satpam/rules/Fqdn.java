package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;

import java.util.List;

/** Port of {@code src/validators/fqdn.js}. */
public final class Fqdn extends BaseRule {
  /** fqdn.validate on a string, also used by {@link Email} and {@link Url}. */
  static boolean isFqdn(String value) {
    if (value.isEmpty()) {
      return true;
    }
    List<String> parts = JsValues.split(value, ".");
    String tld = parts.remove(parts.size() - 1);
    if (parts.isEmpty() || !isTld(tld)) {
      return false;
    }
    for (String part : parts) {
      if (part.isEmpty()) {
        return false;
      }
      for (int i = 0; i < part.length(); i++) {
        char c = part.charAt(i);
        if (!isLetter(c) && !(c >= '0' && c <= '9') && c != '-') {
          return false;
        }
      }
      if (part.charAt(0) == '-' || part.charAt(part.length() - 1) == '-' || part.contains("---")) {
        return false;
      }
    }
    return true;
  }

  /**
   * {@code /^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i}, checked per UTF-16 code unit like a JS
   * non-unicode regex (java.util.regex would see a surrogate pair as one code point above the range).
   */
  private static boolean isTld(String tld) {
    boolean allLetters = tld.length() >= 2;
    for (int i = 0; i < tld.length() && allLetters; i++) {
      allLetters = isLetter(tld.charAt(i));
    }
    if (allLetters) {
      return true;
    }
    if (tld.length() < 4 || !tld.substring(0, 2).equalsIgnoreCase("xn")) {
      return false;
    }
    for (int i = 2; i < tld.length(); i++) {
      char c = tld.charAt(i);
      if (!isAsciiLetter(c) && !(c >= '0' && c <= '9') && c != '-') {
        return false;
      }
    }
    return true;
  }

  /** {@code [a-z\u00a1-\uffff]} with the i flag. */
  private static boolean isLetter(char c) {
    return isAsciiLetter(c) || c >= '\u00a1';
  }

  private static boolean isAsciiLetter(char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  }

  public Fqdn() {
    super("fqdn", "<%= propertyName %> is not a valid FQDN.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    return isFqdn(JsValues.requireString(value, "split"));
  }
}
