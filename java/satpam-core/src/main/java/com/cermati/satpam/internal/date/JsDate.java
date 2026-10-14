package com.cermati.satpam.internal.date;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.zone.ZoneOffsetTransition;
import java.time.zone.ZoneRules;
import java.util.List;

/**
 * ECMAScript {@code Date} arithmetic on time values (milliseconds since the epoch as a
 * {@code double}, {@code NaN} for an invalid date), with local time in a given zone. These are the
 * abstract operations of ECMA-262 21.4.1 (MakeDay, MakeTime, LocalTime, UTC, TimeClip, ...) and the
 * Date constructor and setters built on them.
 */
public final class JsDate {
  static final double MS_PER_SECOND = 1000;
  static final double MS_PER_MINUTE = 60000;
  static final double MS_PER_HOUR = 3600000;
  static final double MS_PER_DAY = 86400000;
  private static final double MAX_TIME = 8.64e15;
  /** V8 DateCache::kMaxTimeBeforeUTCInMs: local times further out are NaN before the UTC conversion. */
  private static final double MAX_TIME_BEFORE_UTC = MAX_TIME + 864000000;
  private static final double MAX_YEAR = 1000000;

  private final ZoneRules rules;

  public JsDate(ZoneId zone) {
    this.rules = zone.getRules();
  }

  // ---- abstract operations ----

  static double toIntegerOrInfinity(double d) {
    if (Double.isNaN(d)) {
      return 0;
    }
    if (Double.isInfinite(d)) {
      return d;
    }
    double t = d < 0 ? Math.ceil(d) : Math.floor(d);
    return t == 0 ? 0 : t;
  }

  static double makeTime(double hour, double min, double sec, double ms) {
    if (!isFinite(hour) || !isFinite(min) || !isFinite(sec) || !isFinite(ms)) {
      return Double.NaN;
    }
    return toIntegerOrInfinity(hour) * MS_PER_HOUR + toIntegerOrInfinity(min) * MS_PER_MINUTE
      + toIntegerOrInfinity(sec) * MS_PER_SECOND + toIntegerOrInfinity(ms);
  }

  static double makeDay(double year, double month, double date) {
    if (!isFinite(year) || !isFinite(month) || !isFinite(date)) {
      return Double.NaN;
    }
    double y = toIntegerOrInfinity(year);
    double m = toIntegerOrInfinity(month);
    double dt = toIntegerOrInfinity(date);
    double ym = y + Math.floor(m / 12);
    if (Math.abs(ym) > MAX_YEAR) {
      return Double.NaN;
    }
    int mn = (int) (((m % 12) + 12) % 12);
    return daysFromCivil((long) ym, mn + 1, 1) + dt - 1;
  }

  static double makeDate(double day, double time) {
    if (!isFinite(day) || !isFinite(time)) {
      return Double.NaN;
    }
    double tv = day * MS_PER_DAY + time;
    return isFinite(tv) ? tv : Double.NaN;
  }

  static double timeClip(double time) {
    if (!isFinite(time) || Math.abs(time) > MAX_TIME) {
      return Double.NaN;
    }
    return toIntegerOrInfinity(time);
  }

  /** Days from 1970-01-01 to the given proleptic Gregorian date (month 1-12). */
  static long daysFromCivil(long year, int month, int day) {
    long y = month <= 2 ? year - 1 : year;
    long era = Math.floorDiv(y, 400);
    long yoe = y - era * 400;
    long mp = (month + 9) % 12;
    long doy = (153 * mp + 2) / 5 + day - 1;
    long doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    return era * 146097 + doe - 719468;
  }

  static boolean isFinite(double d) {
    return !Double.isNaN(d) && !Double.isInfinite(d);
  }

  /** Offset of local time from UTC at time value {@code t}, in ms. */
  double offsetAt(double t) {
    return rules.getOffset(Instant.ofEpochMilli((long) Math.floor(t))).getTotalSeconds() * 1000.0;
  }

  double localTime(double t) {
    return Double.isNaN(t) ? Double.NaN : t + offsetAt(t);
  }

  /**
   * UTC(t) for a local time value: a skipped local time uses the offset before the transition and
   * a repeated one the earlier instant, as ECMA-262 and V8 do.
   */
  double utc(double local) {
    if (!isFinite(local) || Math.abs(local) > MAX_TIME_BEFORE_UTC) {
      return Double.NaN;
    }
    long ms = (long) Math.floor(local);
    LocalDateTime ldt = LocalDateTime.ofEpochSecond(Math.floorDiv(ms, 1000), (int) Math.floorMod(ms, 1000) * 1000000, ZoneOffset.UTC);
    List<ZoneOffset> offsets = rules.getValidOffsets(ldt);
    ZoneOffset offset;
    if (offsets.isEmpty()) {
      ZoneOffsetTransition transition = rules.getTransition(ldt);
      offset = transition.getOffsetBefore();
    } else {
      offset = offsets.get(0);
    }
    return local - offset.getTotalSeconds() * 1000.0;
  }

  // ---- field extraction (from a time value already shifted to local or UTC) ----

  static double day(double t) {
    return Math.floor(t / MS_PER_DAY);
  }

  static double timeWithinDay(double t) {
    return ((t % MS_PER_DAY) + MS_PER_DAY) % MS_PER_DAY;
  }

  /** {year, month (0-11), date (1-31)} of a time value. */
  static long[] civil(double t) {
    long z = (long) day(t) + 719468;
    long era = Math.floorDiv(z, 146097);
    long doe = z - era * 146097;
    long yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    long y = yoe + era * 400;
    long doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    long mp = (5 * doy + 2) / 153;
    long d = doy - (153 * mp + 2) / 5 + 1;
    long m = mp < 10 ? mp + 3 : mp - 9;
    return new long[] {m <= 2 ? y + 1 : y, m - 1, d};
  }

  static double yearFromTime(double t) {
    return Double.isNaN(t) ? Double.NaN : civil(t)[0];
  }

  static double monthFromTime(double t) {
    return Double.isNaN(t) ? Double.NaN : civil(t)[1];
  }

  static double dateFromTime(double t) {
    return Double.isNaN(t) ? Double.NaN : civil(t)[2];
  }

  static double weekDay(double t) {
    return Double.isNaN(t) ? Double.NaN : (((day(t) + 4) % 7) + 7) % 7;
  }

  static double hourFromTime(double t) {
    return Double.isNaN(t) ? Double.NaN : Math.floor(timeWithinDay(t) / MS_PER_HOUR);
  }

  static double minFromTime(double t) {
    return Double.isNaN(t) ? Double.NaN : Math.floor(timeWithinDay(t) / MS_PER_MINUTE) % 60;
  }

  static double secFromTime(double t) {
    return Double.isNaN(t) ? Double.NaN : Math.floor(timeWithinDay(t) / MS_PER_SECOND) % 60;
  }

  static double msFromTime(double t) {
    return Double.isNaN(t) ? Double.NaN : timeWithinDay(t) % MS_PER_SECOND;
  }

  // ---- Date API ----

  /** {@code new Date(y, m, d, h, min, s, ms)}: local time, years 0-99 mean 1900-1999. */
  double construct(double y, double m, double d, double h, double min, double s, double ms) {
    return timeClip(utc(makeDate(makeDay(remapYear(y), m, d), makeTime(h, min, s, ms))));
  }

  /** {@code Date.UTC(y, m, d, h, min, s, ms)}. */
  static double constructUtc(double y, double m, double d, double h, double min, double s, double ms) {
    return timeClip(makeDate(makeDay(remapYear(y), m, d), makeTime(h, min, s, ms)));
  }

  private static double remapYear(double y) {
    if (Double.isNaN(y)) {
      return y;
    }
    double yi = toIntegerOrInfinity(y);
    return yi >= 0 && yi <= 99 ? 1900 + yi : y;
  }

  /** {@code date.setFullYear(year)} in local time. */
  double setFullYear(double t, double year) {
    double local = Double.isNaN(t) ? 0 : localTime(t);
    double newDate = makeDate(makeDay(year, monthFromTime(local), dateFromTime(local)), timeWithinDay(local));
    return timeClip(utc(newDate));
  }

  /** {@code date.setUTCFullYear(year)}. */
  static double setUtcFullYear(double t, double year) {
    double base = Double.isNaN(t) ? 0 : t;
    return timeClip(makeDate(makeDay(year, monthFromTime(base), dateFromTime(base)), timeWithinDay(base)));
  }

  /** {@code date.setMonth(month, date)} in local time. */
  double setMonth(double t, double month, double date) {
    if (Double.isNaN(t)) {
      return Double.NaN;
    }
    double local = localTime(t);
    return timeClip(utc(makeDate(makeDay(yearFromTime(local), month, date), timeWithinDay(local))));
  }

  /** {@code date.setUTCMonth(month, date)}. */
  static double setUtcMonth(double t, double month, double date) {
    if (Double.isNaN(t)) {
      return Double.NaN;
    }
    return timeClip(makeDate(makeDay(yearFromTime(t), month, date), timeWithinDay(t)));
  }

  /** {@code date.setDate(date)} in local time. */
  double setDate(double t, double date) {
    if (Double.isNaN(t)) {
      return Double.NaN;
    }
    double local = localTime(t);
    return timeClip(utc(makeDate(makeDay(yearFromTime(local), monthFromTime(local), date), timeWithinDay(local))));
  }

  /** {@code date.setUTCDate(date)}. */
  static double setUtcDate(double t, double date) {
    if (Double.isNaN(t)) {
      return Double.NaN;
    }
    return timeClip(makeDate(makeDay(yearFromTime(t), monthFromTime(t), date), timeWithinDay(t)));
  }

  /** {@code date.setUTCMinutes(min)}. */
  static double setUtcMinutes(double t, double min) {
    if (Double.isNaN(t)) {
      return Double.NaN;
    }
    return timeClip(makeDate(day(t), makeTime(hourFromTime(t), min, secFromTime(t), msFromTime(t))));
  }

  /** {@code date.getTimezoneOffset()} in minutes. */
  double timezoneOffset(double t) {
    return Double.isNaN(t) ? Double.NaN : (t - localTime(t)) / MS_PER_MINUTE;
  }

  /** {@code new Date(string)} / {@code Date.parse(string)}. */
  double parse(String s) {
    return V8DateParser.parse(s, this);
  }
}
