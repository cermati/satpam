package com.cermati.satpam.internal;

import java.util.regex.Matcher;

/**
 * Port of luxon 3.7 {@code Duration.fromISO(text).toMillis()} with the default "casual" conversion
 * (a year is 365 days, a month 30 days).
 */
public final class IsoDuration {
  private static final JsRegex ISO_DURATION = JsRegex.compile(
    "^-?P(?:(?:(-?\\d{1,20}(?:\\.\\d{1,20})?)Y)?(?:(-?\\d{1,20}(?:\\.\\d{1,20})?)M)?(?:(-?\\d{1,20}(?:\\.\\d{1,20})?)W)?"
      + "(?:(-?\\d{1,20}(?:\\.\\d{1,20})?)D)?(?:T(?:(-?\\d{1,20}(?:\\.\\d{1,20})?)H)?(?:(-?\\d{1,20}(?:\\.\\d{1,20})?)M)?"
      + "(?:(-?\\d{1,20})(?:[.,](-?\\d{1,20}))?S)?)?)$");

  /** Milliseconds per unit, in the order luxon's durationToMillis adds them: s, min, h, d, w, mo, y. */
  private static final double[] UNIT_MILLIS = {
    1000d, 60d * 1000, 60d * 60 * 1000, 24d * 60 * 60 * 1000, 7d * 24 * 60 * 60 * 1000,
    30d * 24 * 60 * 60 * 1000, 365d * 24 * 60 * 60 * 1000
  };

  private IsoDuration() {
  }

  /** The duration in milliseconds, or {@code null} when luxon's duration would be invalid. */
  public static Double toMillis(Object text) {
    if (JsValues.isNil(text)) {
      return null;
    }
    String s = JsValues.toJsString(text);
    Matcher m = ISO_DURATION.pattern().matcher(s);
    if (!m.find()) {
      return null;
    }
    boolean hasNegativePrefix = s.charAt(0) == '-';
    String secondStr = m.group(7);
    boolean negativeSeconds = secondStr != null && secondStr.charAt(0) == '-';

    Double years = maybeNegate(parseFloating(m.group(1)), false, hasNegativePrefix);
    Double months = maybeNegate(parseFloating(m.group(2)), false, hasNegativePrefix);
    Double weeks = maybeNegate(parseFloating(m.group(3)), false, hasNegativePrefix);
    Double days = maybeNegate(parseFloating(m.group(4)), false, hasNegativePrefix);
    Double hours = maybeNegate(parseFloating(m.group(5)), false, hasNegativePrefix);
    Double minutes = maybeNegate(parseFloating(m.group(6)), false, hasNegativePrefix);
    Double seconds = maybeNegate(parseFloating(secondStr), "-0".equals(secondStr), hasNegativePrefix);
    Double milliseconds = maybeNegate(parseMillis(m.group(8)), negativeSeconds, hasNegativePrefix);

    double sum = milliseconds != null ? milliseconds.doubleValue() : 0;
    Double[] values = {seconds, minutes, hours, days, weeks, months, years};
    for (int i = 0; i < values.length; i++) {
      if (JsValues.truthy(values[i])) {
        sum += values[i] * UNIT_MILLIS[i];
      }
    }
    return sum;
  }

  private static Double maybeNegate(Double num, boolean force, boolean hasNegativePrefix) {
    if (num != null && (force || (JsValues.truthy(num) && hasNegativePrefix))) {
      return -num;
    }
    return num;
  }

  private static Double parseFloating(String s) {
    return s == null || s.isEmpty() ? null : Double.parseDouble(s);
  }

  private static Double parseMillis(String fraction) {
    if (fraction == null || fraction.isEmpty()) {
      return null;
    }
    // parseFloat("0." + fraction): a negative fraction ("0.-5") parses as 0
    double f = fraction.charAt(0) == '-' ? 0 : Double.parseDouble("0." + fraction) * 1000;
    return Math.floor(f);
  }
}
