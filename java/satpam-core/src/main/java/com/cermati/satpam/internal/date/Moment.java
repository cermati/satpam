package com.cermati.satpam.internal.date;

import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Port of the parts of moment 2.29.4 that satpam's date and time rules use, with the default
 * {@code en} locale: {@code moment(input[, format[, strict]])}, {@code moment.unix}, {@code add},
 * {@code subtract}, {@code startOf}/{@code endOf}, {@code isAfter}/{@code isBefore}/{@code isSame}
 * (and the {@code OrEqual} variants), {@code diff}, {@code utcOffset} and {@code format}.
 *
 * <p>Local time is the zone of the {@link Clock}, and "now" is its current instant, the
 * counterparts of the process time zone and {@code Date.now()} in Node. Strings that are neither
 * ISO 8601 nor RFC 2822 fall back to {@code new Date(string)} like moment does, via
 * {@link V8DateParser}. Era tokens ({@code N}, {@code yo}) are not supported and throw.
 */
public final class Moment {
  private static final int YEAR = 0;
  private static final int MONTH = 1;
  private static final int DATE = 2;
  private static final int HOUR = 3;
  private static final int MINUTE = 4;
  private static final int SECOND = 5;
  private static final int MILLISECOND = 6;
  private static final int WEEK = 7;
  private static final int WEEKDAY = 8;

  private static final double MS_PER_400_YEARS = (365 * 400 + 97) * 24 * JsDate.MS_PER_HOUR;
  private static final String INVALID_DATE = "Invalid date";

  private final Env env;
  private double d;
  private boolean isUtc;
  private double offset;
  private final boolean flagsValid;
  private final boolean valid;

  /** Where "now" and local time come from. */
  public static final class Env {
    private final Clock clock;
    private final JsDate date;

    public Env(Clock clock) {
      this.clock = clock;
      this.date = new JsDate(clock.getZone());
    }

    double now() {
      return clock.millis();
    }
  }

  private Moment(Env env, double d, boolean flagsValid, boolean isUtc, double offset) {
    this.env = env;
    this.flagsValid = flagsValid;
    this.valid = flagsValid && !Double.isNaN(d);
    this.d = this.valid ? d : Double.NaN;
    this.isUtc = isUtc;
    this.offset = offset;
  }

  // ======================================================================================
  // Creation
  // ======================================================================================

  /** {@code moment()} */
  public static Moment now(Env env) {
    return create(env, com.cermati.satpam.Undefined.INSTANCE, com.cermati.satpam.Undefined.INSTANCE, false);
  }

  /** {@code moment.unix(seconds)} */
  public static Moment unix(Env env, Object seconds) {
    return create(env, JsValues.toNumber(seconds) * 1000, com.cermati.satpam.Undefined.INSTANCE, false);
  }

  /**
   * {@code moment(input, format)} ({@code strict == false}) or {@code moment(input, format, true)}.
   * {@code input} and {@code format} are normalized JS values; pass {@code Undefined.INSTANCE} for
   * a missing argument.
   */
  public static Moment create(Env env, Object input, Object format, boolean strict) {
    // createLocalOrUTC
    if (format instanceof Boolean) {
      strict = (Boolean) format;
      format = com.cermati.satpam.Undefined.INSTANCE;
    }
    if ((input instanceof Map && ((Map<?, ?>) input).isEmpty()) || (input instanceof List && ((List<?>) input).isEmpty())) {
      input = com.cermati.satpam.Undefined.INSTANCE;
    }
    Config config = new Config(env, input, format, strict);

    // prepareConfig
    if (input == null || (JsValues.isUndefined(format) && "".equals(input))) {
      return new Moment(env, Double.NaN, false, false, 0);
    }
    if (format instanceof List) {
      configFromStringAndArray(config);
    } else if (JsValues.truthy(format)) {
      configFromStringAndFormat(config);
    } else {
      configFromInput(config);
    }
    if (!config.isValid()) {
      config.d = null;
    }

    // createFromConfig
    checkOverflow(config);
    return new Moment(env, config.d == null ? Double.NaN : config.d, config.flagsValid(), false, 0);
  }

  private Moment copy() {
    return new Moment(env, d, flagsValid, isUtc, offset);
  }

  // ---- parsing config ----

  private static final class Config {
    final Env env;
    Object input;
    Object format;
    final boolean strict;
    boolean useUtc;
    Double d;
    Double[] a;
    Double tzm;
    Boolean isValidCache;
    Map<String, Double> w;
    Double dayOfYear;
    boolean nextDay;
    String meridiemInput;

    // parsing flags
    boolean empty;
    final List<String> unusedTokens = new ArrayList<>();
    int overflow = -2;
    int charsLeftOver;
    boolean invalidMonth;
    boolean invalidWeekday;
    boolean weekdayMismatch;
    boolean invalidFormat;
    boolean bigHour;
    String flagMeridiem;
    Double[] parsedDateParts;
    boolean overflowDayOfYear;
    boolean overflowWeeks;
    boolean overflowWeekday;

    Config(Env env, Object input, Object format, boolean strict) {
      this.env = env;
      this.input = input;
      this.format = format;
      this.strict = strict;
    }

    Config copyForFormat(Object fmt) {
      Config copy = new Config(env, input, fmt, strict);
      copy.useUtc = useUtc;
      return copy;
    }

    void copyResultFrom(Config other) {
      useUtc = other.useUtc;
      d = other.d;
      a = other.a;
      tzm = other.tzm;
      isValidCache = other.isValidCache;
      w = other.w;
      dayOfYear = other.dayOfYear;
      nextDay = other.nextDay;
      meridiemInput = other.meridiemInput;
      empty = other.empty;
      unusedTokens.clear();
      unusedTokens.addAll(other.unusedTokens);
      overflow = other.overflow;
      charsLeftOver = other.charsLeftOver;
      invalidMonth = other.invalidMonth;
      invalidWeekday = other.invalidWeekday;
      weekdayMismatch = other.weekdayMismatch;
      invalidFormat = other.invalidFormat;
      bigHour = other.bigHour;
      flagMeridiem = other.flagMeridiem;
      parsedDateParts = other.parsedDateParts;
      overflowDayOfYear = other.overflowDayOfYear;
      overflowWeeks = other.overflowWeeks;
      overflowWeekday = other.overflowWeekday;
    }

    /** moment's isValid(config): cached, like {@code config._isValid}. */
    boolean isValid() {
      if (isValidCache == null) {
        isValidCache = d != null && !Double.isNaN(d) && flagsValid();
      }
      return isValidCache;
    }

    /** The parsing-flag part of isValid, recomputed by every Moment built from these flags. */
    boolean flagsValid() {
      boolean parsedParts = false;
      if (parsedDateParts != null) {
        for (Double part : parsedDateParts) {
          parsedParts |= part != null;
        }
      }
      boolean ok = overflow < 0 && !empty && !invalidMonth && !invalidWeekday && !weekdayMismatch
        && !invalidFormat && (flagMeridiem == null || flagMeridiem.isEmpty() || parsedParts);
      if (strict) {
        ok = ok && charsLeftOver == 0 && unusedTokens.isEmpty() && !bigHour;
      }
      return ok;
    }

    Double[] array() {
      if (a == null) {
        a = new Double[7];
      }
      return a;
    }
  }

  private static void configFromInput(Config config) {
    Object input = config.input;
    if (JsValues.isUndefined(input)) {
      config.d = config.env.now();
    } else if (input instanceof String) {
      configFromString(config);
    } else if (input instanceof List) {
      List<Object> list = JsValues.asList(input);
      Double[] a = config.array();
      for (int i = 0; i < Math.min(7, list.size()); i++) {
        a[i] = parseInt(JsValues.toJsString(list.get(i)));
      }
      configFromArray(config);
    } else if (input instanceof Map) {
      configFromObject(config);
    } else if (input instanceof Double) {
      config.d = JsDate.timeClip((Double) input);
    } else {
      config.d = config.env.date.parse(JsValues.toJsString(input) + (config.useUtc ? " UTC" : ""));
    }
  }

  private static void configFromObject(Config config) {
    if (config.d != null) {
      return;
    }
    Map<String, Object> normalized = new LinkedHashMap<>();
    for (Map.Entry<String, Object> entry : JsValues.asMap(config.input).entrySet()) {
      String unit = normalizeUnits(entry.getKey());
      if (unit != null) {
        normalized.put(unit, entry.getValue());
      }
    }
    Object dayOrDate = normalized.containsKey("day") && !JsValues.isUndefined(normalized.get("day"))
      ? normalized.get("day") : normalized.get("date");
    Object[] parts = {normalized.get("year"), normalized.get("month"), dayOrDate, normalized.get("hour"),
      normalized.get("minute"), normalized.get("second"), normalized.get("millisecond")};
    Double[] a = config.array();
    for (int i = 0; i < 7; i++) {
      Object part = parts[i];
      if (JsValues.isNil(part)) {
        a[i] = null;
      } else if (!JsValues.truthy(part)) {
        // obj && parseInt(obj, 10): falsy values are kept as they are
        a[i] = JsValues.toNumber(part);
      } else {
        a[i] = parseInt(JsValues.toJsString(part));
      }
    }
    configFromArray(config);
  }

  // ---- strings: ASP.NET, ISO 8601, RFC 2822, fallback ----

  private static final JsRegex ASP_NET_JSON = JsRegex.compile("^\\/?Date\\((-?\\d+)", "i");
  private static final JsRegex EXTENDED_ISO = JsRegex.compile(
    "^\\s*((?:[+-]\\d{6}|\\d{4})-(?:\\d\\d-\\d\\d|W\\d\\d-\\d|W\\d\\d|\\d\\d\\d|\\d\\d))(?:(T| )(\\d\\d(?::\\d\\d(?::\\d\\d(?:[.,]\\d+)?)?)?)([+-]\\d\\d(?::?\\d\\d)?|\\s*Z)?)?$");
  private static final JsRegex BASIC_ISO = JsRegex.compile(
    "^\\s*((?:[+-]\\d{6}|\\d{4})(?:\\d\\d\\d\\d|W\\d\\d\\d|W\\d\\d|\\d\\d\\d|\\d\\d|))(?:(T| )(\\d\\d(?:\\d\\d(?:\\d\\d(?:[.,]\\d+)?)?)?)([+-]\\d\\d(?::?\\d\\d)?|\\s*Z)?)?$");
  private static final JsRegex TZ_REGEX = JsRegex.compile("Z|[+-]\\d\\d(?::?\\d\\d)?");
  private static final Object[][] ISO_DATES = {
    {"YYYYYY-MM-DD", JsRegex.compile("[+-]\\d{6}-\\d\\d-\\d\\d"), true},
    {"YYYY-MM-DD", JsRegex.compile("\\d{4}-\\d\\d-\\d\\d"), true},
    {"GGGG-[W]WW-E", JsRegex.compile("\\d{4}-W\\d\\d-\\d"), true},
    {"GGGG-[W]WW", JsRegex.compile("\\d{4}-W\\d\\d"), false},
    {"YYYY-DDD", JsRegex.compile("\\d{4}-\\d{3}"), true},
    {"YYYY-MM", JsRegex.compile("\\d{4}-\\d\\d"), false},
    {"YYYYYYMMDD", JsRegex.compile("[+-]\\d{10}"), true},
    {"YYYYMMDD", JsRegex.compile("\\d{8}"), true},
    {"GGGG[W]WWE", JsRegex.compile("\\d{4}W\\d{3}"), true},
    {"GGGG[W]WW", JsRegex.compile("\\d{4}W\\d{2}"), false},
    {"YYYYDDD", JsRegex.compile("\\d{7}"), true},
    {"YYYYMM", JsRegex.compile("\\d{6}"), false},
    {"YYYY", JsRegex.compile("\\d{4}"), false},
  };
  private static final Object[][] ISO_TIMES = {
    {"HH:mm:ss.SSSS", JsRegex.compile("\\d\\d:\\d\\d:\\d\\d\\.\\d+")},
    {"HH:mm:ss,SSSS", JsRegex.compile("\\d\\d:\\d\\d:\\d\\d,\\d+")},
    {"HH:mm:ss", JsRegex.compile("\\d\\d:\\d\\d:\\d\\d")},
    {"HH:mm", JsRegex.compile("\\d\\d:\\d\\d")},
    {"HHmmss.SSSS", JsRegex.compile("\\d\\d\\d\\d\\d\\d\\.\\d+")},
    {"HHmmss,SSSS", JsRegex.compile("\\d\\d\\d\\d\\d\\d,\\d+")},
    {"HHmmss", JsRegex.compile("\\d\\d\\d\\d\\d\\d")},
    {"HHmm", JsRegex.compile("\\d\\d\\d\\d")},
    {"HH", JsRegex.compile("\\d\\d")},
  };
  private static final JsRegex RFC_2822 = JsRegex.compile(
    "^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\\s)?(\\d{1,2})\\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s(\\d{2,4})\\s(\\d\\d):(\\d\\d)(?::(\\d\\d))?\\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\\d{4}))$");
  private static final JsRegex RFC_COMMENTS = JsRegex.compile("\\([^()]*\\)|[\\n\\t]");
  private static final JsRegex RFC_SPACES = JsRegex.compile("(\\s\\s+)");
  private static final JsRegex RFC_LEADING = JsRegex.compile("^\\s\\s*");
  private static final JsRegex RFC_TRAILING = JsRegex.compile("\\s\\s*$");
  private static final Map<String, Integer> OBS_OFFSETS = new HashMap<>();

  static {
    OBS_OFFSETS.put("UT", 0);
    OBS_OFFSETS.put("GMT", 0);
    OBS_OFFSETS.put("EDT", -4 * 60);
    OBS_OFFSETS.put("EST", -5 * 60);
    OBS_OFFSETS.put("CDT", -5 * 60);
    OBS_OFFSETS.put("CST", -6 * 60);
    OBS_OFFSETS.put("MDT", -6 * 60);
    OBS_OFFSETS.put("MST", -7 * 60);
    OBS_OFFSETS.put("PDT", -7 * 60);
    OBS_OFFSETS.put("PST", -8 * 60);
  }

  private static void configFromString(Config config) {
    String s = (String) config.input;
    Matcher aspNet = ASP_NET_JSON.pattern().matcher(s);
    if (aspNet.find()) {
      config.d = JsDate.timeClip(JsValues.toNumber(aspNet.group(1)));
      return;
    }

    configFromIso(config);
    if (Boolean.FALSE.equals(config.isValidCache)) {
      config.isValidCache = null;
    } else {
      return;
    }

    configFromRfc2822(config);
    if (Boolean.FALSE.equals(config.isValidCache)) {
      config.isValidCache = null;
    } else {
      return;
    }

    if (config.strict) {
      config.isValidCache = false;
    } else {
      config.d = config.env.date.parse(s + (config.useUtc ? " UTC" : ""));
    }
  }

  private static void configFromIso(Config config) {
    String string = JsValues.toJsString(config.input);
    Matcher match = EXTENDED_ISO.pattern().matcher(string);
    if (!match.find()) {
      match = BASIC_ISO.pattern().matcher(string);
      if (!match.find()) {
        config.isValidCache = false;
        return;
      }
    }
    String dateFormat = null;
    boolean allowTime = false;
    for (Object[] isoDate : ISO_DATES) {
      if (((JsRegex) isoDate[1]).pattern().matcher(match.group(1)).find()) {
        dateFormat = (String) isoDate[0];
        allowTime = (Boolean) isoDate[2];
        break;
      }
    }
    if (dateFormat == null) {
      config.isValidCache = false;
      return;
    }
    String timeFormat = null;
    if (match.group(3) != null && !match.group(3).isEmpty()) {
      for (Object[] isoTime : ISO_TIMES) {
        if (((JsRegex) isoTime[1]).pattern().matcher(match.group(3)).find()) {
          timeFormat = (match.group(2) == null || match.group(2).isEmpty() ? " " : match.group(2)) + isoTime[0];
          break;
        }
      }
      if (timeFormat == null) {
        config.isValidCache = false;
        return;
      }
    }
    if (!allowTime && timeFormat != null) {
      config.isValidCache = false;
      return;
    }
    String tzFormat = null;
    if (match.group(4) != null && !match.group(4).isEmpty()) {
      if (TZ_REGEX.pattern().matcher(match.group(4)).find()) {
        tzFormat = "Z";
      } else {
        config.isValidCache = false;
        return;
      }
    }
    config.format = dateFormat + (timeFormat == null ? "" : timeFormat) + (tzFormat == null ? "" : tzFormat);
    configFromStringAndFormat(config);
  }

  private static void configFromRfc2822(Config config) {
    String s = JsValues.toJsString(config.input);
    s = RFC_COMMENTS.pattern().matcher(s).replaceAll(" ");
    s = RFC_SPACES.pattern().matcher(s).replaceAll(" ");
    s = RFC_LEADING.pattern().matcher(s).replaceFirst("");
    s = RFC_TRAILING.pattern().matcher(s).replaceFirst("");
    Matcher match = RFC_2822.pattern().matcher(s);
    if (!match.find()) {
      config.isValidCache = false;
      return;
    }
    List<Double> parsed = new ArrayList<>();
    parsed.add(untruncateYear(match.group(4)));
    parsed.add((double) Arrays.asList(MONTHS_SHORT).indexOf(match.group(3)));
    parsed.add(parseInt(match.group(2)));
    parsed.add(parseInt(match.group(5)));
    parsed.add(parseInt(match.group(6)));
    if (match.group(7) != null && !match.group(7).isEmpty()) {
      parsed.add(parseInt(match.group(7)));
    }

    String weekdayStr = match.group(1);
    if (weekdayStr != null && !weekdayStr.isEmpty()) {
      double weekdayProvided = Arrays.asList(WEEKDAYS_SHORT).indexOf(weekdayStr);
      double actual = JsDate.weekDay(config.env.date.localTime(
        config.env.date.construct(parsed.get(0), parsed.get(1), parsed.get(2), 0, 0, 0, 0)));
      if (weekdayProvided != actual) {
        config.weekdayMismatch = true;
        config.isValidCache = false;
        return;
      }
    }

    Double[] a = new Double[7];
    for (int i = 0; i < parsed.size(); i++) {
      a[i] = parsed.get(i);
    }
    config.a = a;
    double tzm;
    if (match.group(8) != null && !match.group(8).isEmpty()) {
      tzm = OBS_OFFSETS.get(match.group(8));
    } else if (match.group(9) != null && !match.group(9).isEmpty()) {
      tzm = 0;
    } else {
      double hm = parseInt(match.group(10));
      double m = hm % 100;
      double h = (hm - m) / 100;
      tzm = h * 60 + m;
    }
    config.tzm = tzm;
    double date = createUtcDate(parsed.toArray(new Double[0]));
    config.d = JsDate.setUtcMinutes(date, JsDate.minFromTime(date) - tzm);
  }

  private static double untruncateYear(String yearStr) {
    double year = parseInt(yearStr);
    if (year <= 49) {
      return 2000 + year;
    } else if (year <= 999) {
      return 1900 + year;
    }
    return year;
  }

  // ---- format strings ----

  private static final JsRegex FORMATTING_TOKENS = JsRegex.compile(
    "(\\[[^\\[]*\\])|(\\\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)");
  private static final JsRegex LOCAL_FORMATTING_TOKENS = JsRegex.compile("(\\[[^\\[]*\\])|(\\\\)?(LTS|LT|LL?L?L?|l{1,4})");
  private static final Map<String, String> LONG_DATE_FORMATS = new HashMap<>();

  static {
    LONG_DATE_FORMATS.put("LTS", "h:mm:ss A");
    LONG_DATE_FORMATS.put("LT", "h:mm A");
    LONG_DATE_FORMATS.put("L", "MM/DD/YYYY");
    LONG_DATE_FORMATS.put("LL", "MMMM D, YYYY");
    LONG_DATE_FORMATS.put("LLL", "MMMM D, YYYY h:mm A");
    LONG_DATE_FORMATS.put("LLLL", "dddd, MMMM D, YYYY h:mm A");
    // longDateFormat(key) derives a lower-case key from the upper-case one
    LONG_DATE_FORMATS.put("l", "M/D/YYYY");
    LONG_DATE_FORMATS.put("ll", "MMM D, YYYY");
    LONG_DATE_FORMATS.put("lll", "MMM D, YYYY h:mm A");
    LONG_DATE_FORMATS.put("llll", "ddd, MMM D, YYYY h:mm A");
  }

  /** Tokens with a format function in moment ({@code formatTokenFunctions}); others are literals. */
  private static final Set<String> FORMAT_TOKENS = new HashSet<>(Arrays.asList(
    "M", "MM", "Mo", "MMM", "MMMM", "Y", "YY", "YYYY", "YYYYY", "YYYYYY", "w", "ww", "wo", "W", "WW", "Wo",
    "d", "do", "dd", "ddd", "dddd", "e", "E", "H", "HH", "h", "hh", "k", "kk", "hmm", "hmmss", "Hmm", "Hmmss",
    "a", "A", "Z", "ZZ", "N", "NN", "NNN", "NNNN", "NNNNN", "y", "yy", "yyy", "yyyy", "yo", "gg", "GG", "gggg",
    "ggggg", "GGGG", "GGGGG", "Q", "Qo", "D", "DD", "Do", "DDD", "DDDD", "DDDo", "m", "mm", "s", "ss", "S", "SS",
    "SSS", "SSSS", "SSSSS", "SSSSSS", "SSSSSSS", "SSSSSSSS", "SSSSSSSSS", "z", "zz", "X", "x"));

  private static final JsRegex MATCH1 = JsRegex.compile("\\d");
  private static final JsRegex MATCH2 = JsRegex.compile("\\d\\d");
  private static final JsRegex MATCH3 = JsRegex.compile("\\d{3}");
  private static final JsRegex MATCH4 = JsRegex.compile("\\d{4}");
  private static final JsRegex MATCH6 = JsRegex.compile("[+-]?\\d{6}");
  private static final JsRegex MATCH1TO2 = JsRegex.compile("\\d\\d?");
  private static final JsRegex MATCH3TO4 = JsRegex.compile("\\d\\d\\d\\d?");
  private static final JsRegex MATCH5TO6 = JsRegex.compile("\\d\\d\\d\\d\\d\\d?");
  private static final JsRegex MATCH1TO3 = JsRegex.compile("\\d{1,3}");
  private static final JsRegex MATCH1TO4 = JsRegex.compile("\\d{1,4}");
  private static final JsRegex MATCH1TO6 = JsRegex.compile("[+-]?\\d{1,6}");
  private static final JsRegex MATCH_UNSIGNED = JsRegex.compile("\\d+");
  private static final JsRegex MATCH_SIGNED = JsRegex.compile("[+-]?\\d+");
  private static final JsRegex MATCH_SHORT_OFFSET = JsRegex.compile("Z|[+-]\\d\\d(?::?\\d\\d)?", "i");
  private static final JsRegex MATCH_TIMESTAMP = JsRegex.compile("[+-]?\\d+(\\.\\d{1,3})?");
  private static final JsRegex MATCH_WORD = JsRegex.compile(
    "[0-9]{0,256}['a-z\\u00A0-\\u05FF\\u0700-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFF07\\uFF10-\\uFFEF]{1,256}|[\\u0600-\\u06FF\\/]{1,256}(\\s*?[\\u0600-\\u06FF]{1,256}){1,2}", "i");
  private static final JsRegex MATCH_MERIDIEM = JsRegex.compile("[ap]\\.?m?\\.?", "i");
  private static final JsRegex ORDINAL_STRICT = JsRegex.compile("\\d{1,2}(th|st|nd|rd)");
  private static final JsRegex ORDINAL_LENIENT = JsRegex.compile("\\d{1,2}(th|st|nd|rd)|\\d{1,2}");
  private static final JsRegex CHUNK_OFFSET = JsRegex.compile("([\\+\\-]|\\d\\d)", "i");
  private static final JsRegex UNESCAPE = JsRegex.compile("\\\\(\\[)|\\\\(\\])|\\[([^\\]\\[]*)\\]|\\\\(.)");
  private static final JsRegex BRACKET_START = JsRegex.compile("\\[[\\s\\S]");
  private static final JsRegex REGEX_SPECIALS = JsRegex.compile("[-\\/\\\\^$*+?.()|[\\]{}]");

  /** {non-strict, strict} parse regex per token (moment's addRegexToken). */
  private static final Map<String, JsRegex[]> REGEXES = new HashMap<>();

  private static void regex(JsRegex regex, JsRegex strict, String... tokens) {
    for (String token : tokens) {
      REGEXES.put(token, new JsRegex[] {regex, strict == null ? regex : strict});
    }
  }

  static {
    regex(MATCH1TO2, null, "M", "w", "W", "d", "e", "E", "H", "h", "k", "D", "m", "s");
    regex(MATCH1TO2, MATCH2, "MM", "YY", "ww", "WW", "HH", "hh", "kk", "DD", "mm", "ss", "GG", "gg");
    regex(MATCH_WORD, null, "MMM", "MMMM", "dd", "ddd", "dddd");
    regex(MATCH_SIGNED, null, "Y", "G", "g", "x");
    regex(MATCH1TO4, MATCH4, "YYYY", "GGGG", "gggg");
    regex(MATCH1TO6, MATCH6, "YYYYY", "YYYYYY", "GGGGG", "ggggg");
    regex(MATCH_MERIDIEM, null, "a", "A");
    regex(MATCH3TO4, null, "hmm", "Hmm");
    regex(MATCH5TO6, null, "hmmss", "Hmmss");
    regex(MATCH_SHORT_OFFSET, null, "Z", "ZZ");
    regex(MATCH1, null, "Q");
    regex(ORDINAL_LENIENT, ORDINAL_STRICT, "Do");
    regex(MATCH1TO3, null, "DDD");
    regex(MATCH3, null, "DDDD");
    regex(MATCH1TO3, MATCH1, "S");
    regex(MATCH1TO3, MATCH2, "SS");
    regex(MATCH1TO3, MATCH3, "SSS");
    regex(MATCH_UNSIGNED, null, "SSSS", "SSSSS", "SSSSSS", "SSSSSSS", "SSSSSSSS", "SSSSSSSSS", "y", "yy", "yyy", "yyyy");
    regex(MATCH_TIMESTAMP, null, "X");
  }

  private static JsRegex parseRegexForToken(String token, boolean strict) {
    JsRegex[] regexes = REGEXES.get(token);
    if (regexes != null) {
      return regexes[strict ? 1 : 0];
    }
    if (token.startsWith("N") || token.equals("yo")) {
      throw new IllegalArgumentException("moment era format token is not supported: " + token);
    }
    return JsRegex.compile(regexEscape(unescapeFormat(token)));
  }

  /** moment's unescapeFormat, including its {@code "[]" -> "undefined"} quirk. */
  private static String unescapeFormat(String s) {
    String withoutFirstBackslash = s.replaceFirst("\\\\", "");
    Matcher m = UNESCAPE.pattern().matcher(withoutFirstBackslash);
    StringBuffer sb = new StringBuffer();
    while (m.find()) {
      String replacement = firstTruthy(m.group(1), m.group(2), m.group(3), m.group(4));
      m.appendReplacement(sb, Matcher.quoteReplacement(replacement == null ? "undefined" : replacement));
    }
    m.appendTail(sb);
    return sb.toString();
  }

  private static String firstTruthy(String... values) {
    for (String value : values) {
      if (value != null && !value.isEmpty()) {
        return value;
      }
    }
    // p1 || p2 || p3 || p4 returns the last operand when all are falsy
    return values[values.length - 1] == null ? null : values[values.length - 1];
  }

  private static String regexEscape(String s) {
    return REGEX_SPECIALS.pattern().matcher(s).replaceAll("\\\\$0");
  }

  private static String expandFormat(String format) {
    for (int i = 5; i >= 0 && LOCAL_FORMATTING_TOKENS.pattern().matcher(format).find(); i--) {
      Matcher m = LOCAL_FORMATTING_TOKENS.pattern().matcher(format);
      StringBuffer sb = new StringBuffer();
      while (m.find()) {
        String replacement = LONG_DATE_FORMATS.get(m.group());
        m.appendReplacement(sb, Matcher.quoteReplacement(replacement == null ? m.group() : replacement));
      }
      m.appendTail(sb);
      format = sb.toString();
    }
    return format;
  }

  private static List<String> formatTokens(Object format) {
    if (!(format instanceof String)) {
      throw new IllegalArgumentException("TypeError: format.match is not a function");
    }
    List<String> tokens = new ArrayList<>();
    Matcher m = FORMATTING_TOKENS.pattern().matcher(expandFormat((String) format));
    while (m.find()) {
      tokens.add(m.group());
    }
    return tokens;
  }

  private static void configFromStringAndFormat(Config config) {
    config.a = new Double[7];
    config.empty = true;

    String string = JsValues.toJsString(config.input);
    int stringLength = string.length();
    int totalParsedInputLength = 0;

    for (String token : formatTokens(config.format)) {
      Matcher m = parseRegexForToken(token, config.strict).pattern().matcher(string);
      String parsedInput = m.find() ? m.group() : null;
      boolean parsed = parsedInput != null && !parsedInput.isEmpty();
      if (parsed) {
        int index = string.indexOf(parsedInput);
        string = string.substring(index + parsedInput.length());
        totalParsedInputLength += parsedInput.length();
      }
      if (FORMAT_TOKENS.contains(token)) {
        if (parsed) {
          config.empty = false;
        } else {
          config.unusedTokens.add(token);
        }
        if (parsedInput != null) {
          addTimeToArrayFromToken(token, parsedInput, config);
        }
      } else if (config.strict && !parsed) {
        config.unusedTokens.add(token);
      }
    }

    config.charsLeftOver = stringLength - totalParsedInputLength;

    Double[] a = config.a;
    if (a[HOUR] != null && a[HOUR] <= 12 && config.bigHour && a[HOUR] > 0) {
      config.bigHour = false;
    }

    config.parsedDateParts = a.clone();
    config.flagMeridiem = config.meridiemInput;
    a[HOUR] = meridiemFixWrap(a[HOUR], config.meridiemInput);

    configFromArray(config);
    checkOverflow(config);
  }

  private static Double meridiemFixWrap(Double hour, String meridiem) {
    if (meridiem == null) {
      return hour;
    }
    boolean isPm = isPm(meridiem);
    if (isPm && hour != null && hour < 12) {
      return hour + 12;
    }
    if (!isPm && hour != null && hour == 12) {
      return 0.0;
    }
    return hour;
  }

  private static boolean isPm(String input) {
    String lower = input.toLowerCase(java.util.Locale.ROOT);
    return !lower.isEmpty() && lower.charAt(0) == 'p';
  }

  private static void configFromStringAndArray(Config config) {
    List<Object> formats = JsValues.asList(config.format);
    if (formats.isEmpty()) {
      config.invalidFormat = true;
      config.d = Double.NaN;
      return;
    }
    Config bestMoment = null;
    Config tempConfig = null;
    Integer scoreToBeat = null;
    boolean bestFormatIsValid = false;
    for (Object format : formats) {
      tempConfig = config.copyForFormat(format);
      configFromStringAndFormat(tempConfig);
      boolean validFormatFound = tempConfig.isValid();
      int currentScore = tempConfig.charsLeftOver + tempConfig.unusedTokens.size() * 10;
      if (!bestFormatIsValid) {
        if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
          scoreToBeat = currentScore;
          bestMoment = tempConfig;
          if (validFormatFound) {
            bestFormatIsValid = true;
          }
        }
      } else if (currentScore < scoreToBeat) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
      }
    }
    config.copyResultFrom(bestMoment != null ? bestMoment : tempConfig);
  }

  // ---- parse tokens (moment's addParseToken callbacks) ----

  private static void addTimeToArrayFromToken(String token, String input, Config config) {
    Double[] a = config.a;
    switch (token) {
      case "M":
      case "MM":
        a[MONTH] = toInt(input) - 1;
        break;
      case "MMM":
      case "MMMM": {
        Integer month = monthsParse(input, token, config.strict);
        if (month != null) {
          a[MONTH] = (double) month;
        } else {
          config.invalidMonth = true;
        }
        break;
      }
      case "YYYYY":
      case "YYYYYY":
      case "y":
      case "yy":
      case "yyy":
      case "yyyy":
        a[YEAR] = toInt(input);
        break;
      case "YYYY":
        a[YEAR] = input.length() == 2 ? parseTwoDigitYear(input) : toInt(input);
        break;
      case "YY":
        a[YEAR] = parseTwoDigitYear(input);
        break;
      case "Y":
        a[YEAR] = parseInt(input);
        break;
      case "w":
      case "ww":
      case "W":
      case "WW":
        week(config).put(token.substring(0, 1), toInt(input));
        break;
      case "dd":
      case "ddd":
      case "dddd": {
        Integer weekday = weekdaysParse(input, token, config.strict);
        if (weekday != null) {
          week(config).put("d", (double) weekday);
        } else {
          week(config);
          config.invalidWeekday = true;
        }
        break;
      }
      case "d":
      case "e":
      case "E":
        week(config).put(token, toInt(input));
        break;
      case "gggg":
      case "ggggg":
      case "GGGG":
      case "GGGGG":
        week(config).put(token.substring(0, 2), toInt(input));
        break;
      case "gg":
      case "GG":
        week(config).put(token, parseTwoDigitYear(input));
        break;
      case "H":
      case "HH":
        a[HOUR] = toInt(input);
        break;
      case "k":
      case "kk": {
        double k = toInt(input);
        a[HOUR] = k == 24 ? 0 : k;
        break;
      }
      case "a":
      case "A":
        config.meridiemInput = input;
        break;
      case "h":
      case "hh":
        a[HOUR] = toInt(input);
        config.bigHour = true;
        break;
      case "hmm":
      case "Hmm": {
        int pos = input.length() - 2;
        a[HOUR] = toInt(input.substring(0, pos));
        a[MINUTE] = toInt(input.substring(pos));
        config.bigHour |= token.equals("hmm");
        break;
      }
      case "hmmss":
      case "Hmmss": {
        int pos1 = input.length() - 4;
        int pos2 = input.length() - 2;
        a[HOUR] = toInt(input.substring(0, pos1));
        a[MINUTE] = toInt(input.substring(pos1, pos1 + 2));
        a[SECOND] = toInt(input.substring(pos2));
        config.bigHour |= token.equals("hmmss");
        break;
      }
      case "Z":
      case "ZZ":
        config.useUtc = true;
        config.tzm = offsetFromString(input);
        break;
      case "Q":
        a[MONTH] = (toInt(input) - 1) * 3;
        break;
      case "D":
      case "DD":
        a[DATE] = toInt(input);
        break;
      case "Do": {
        Matcher m = MATCH1TO2.pattern().matcher(input);
        m.find();
        a[DATE] = toInt(m.group());
        break;
      }
      case "DDD":
      case "DDDD":
        config.dayOfYear = toInt(input);
        break;
      case "m":
      case "mm":
        a[MINUTE] = toInt(input);
        break;
      case "s":
      case "ss":
        a[SECOND] = toInt(input);
        break;
      case "X":
        config.d = JsDate.timeClip(parseFloat(input) * 1000);
        break;
      case "x":
        config.d = JsDate.timeClip(toInt(input));
        break;
      default:
        if (token.matches("S{1,9}")) {
          a[MILLISECOND] = toInt(JsValues.toNumber("0." + input) * 1000);
        }
        break;
    }
  }

  private static Map<String, Double> week(Config config) {
    if (config.w == null) {
      config.w = new HashMap<>();
    }
    return config.w;
  }

  private static double parseTwoDigitYear(String input) {
    double year = toInt(input);
    return year + (year > 68 ? 1900 : 2000);
  }

  private static Double offsetFromString(String string) {
    List<String> matches = new ArrayList<>();
    Matcher m = MATCH_SHORT_OFFSET.pattern().matcher(string == null ? "" : string);
    while (m.find()) {
      matches.add(m.group());
    }
    if (matches.isEmpty()) {
      return null;
    }
    String chunk = matches.get(matches.size() - 1);
    List<String> parts = new ArrayList<>();
    Matcher pm = CHUNK_OFFSET.pattern().matcher(chunk);
    while (pm.find()) {
      parts.add(pm.group());
    }
    if (parts.isEmpty()) {
      parts = Arrays.asList("-", "0", "0");
    }
    double minutes = JsValues.toNumber(parts.get(1)) * 60 + toInt(parts.size() > 2 ? parts.get(2) : null);
    if (minutes == 0) {
      return 0.0;
    }
    return "+".equals(parts.get(0)) ? minutes : -minutes;
  }

  // ---- en locale ----

  private static final String[] MONTHS = {"January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"};
  private static final String[] MONTHS_SHORT = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"};
  private static final String[] WEEKDAYS = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"};
  private static final String[] WEEKDAYS_SHORT = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
  private static final String[] WEEKDAYS_MIN = {"Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"};
  private static final int WEEK_DOW = 0;
  private static final int WEEK_DOY = 6;

  /** ASCII-only case-insensitive, like a JS {@code /i} regex over ASCII names. */
  private static boolean matchesIgnoreCase(String regex, String input) {
    return Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(input).find();
  }

  private static Integer monthsParse(String monthName, String token, boolean strict) {
    for (int i = 0; i < 12; i++) {
      if (strict && token.equals("MMMM") && matchesIgnoreCase("^" + MONTHS[i] + "\\z", monthName)) {
        return i;
      } else if (strict && token.equals("MMM") && matchesIgnoreCase("^" + MONTHS_SHORT[i] + "\\z", monthName)) {
        return i;
      } else if (!strict && matchesIgnoreCase("^" + MONTHS[i] + "|^" + MONTHS_SHORT[i], monthName)) {
        return i;
      }
    }
    return null;
  }

  private static Integer weekdaysParse(String weekdayName, String token, boolean strict) {
    for (int i = 0; i < 7; i++) {
      if (strict && token.equals("dddd") && matchesIgnoreCase("^" + WEEKDAYS[i] + "\\z", weekdayName)) {
        return i;
      } else if (strict && token.equals("ddd") && matchesIgnoreCase("^" + WEEKDAYS_SHORT[i] + "\\z", weekdayName)) {
        return i;
      } else if (strict && token.equals("dd") && matchesIgnoreCase("^" + WEEKDAYS_MIN[i] + "\\z", weekdayName)) {
        return i;
      } else if (!strict && matchesIgnoreCase("^" + WEEKDAYS[i] + "|^" + WEEKDAYS_SHORT[i] + "|^" + WEEKDAYS_MIN[i], weekdayName)) {
        return i;
      }
    }
    return null;
  }

  // ---- date from parts ----

  private static double[] currentDateArray(Config config) {
    double now = config.env.now();
    double t = config.useUtc ? now : config.env.date.localTime(now);
    return new double[] {JsDate.yearFromTime(t), JsDate.monthFromTime(t), JsDate.dateFromTime(t)};
  }

  private static void configFromArray(Config config) {
    if (config.d != null) {
      return;
    }
    Double[] a = config.array();
    double[] currentDate = currentDateArray(config);

    if (config.w != null && a[DATE] == null && a[MONTH] == null) {
      dayOfYearFromWeekInfo(config);
    }

    if (config.dayOfYear != null) {
      double yearToUse = a[YEAR] != null ? a[YEAR] : currentDate[YEAR];
      if (config.dayOfYear > daysInYear(yearToUse) || config.dayOfYear == 0) {
        config.overflowDayOfYear = true;
      }
      double date = createUtcDate(yearToUse, 0.0, config.dayOfYear);
      a[MONTH] = JsDate.monthFromTime(date);
      a[DATE] = JsDate.dateFromTime(date);
    }

    Double[] input = new Double[7];
    int i;
    for (i = 0; i < 3 && a[i] == null; ++i) {
      a[i] = input[i] = currentDate[i];
    }
    for (; i < 7; i++) {
      a[i] = input[i] = a[i] == null ? (i == 2 ? 1.0 : 0.0) : a[i];
    }

    if (a[HOUR] == 24 && a[MINUTE] == 0 && a[SECOND] == 0 && a[MILLISECOND] == 0) {
      config.nextDay = true;
      a[HOUR] = 0.0;
    }

    config.d = config.useUtc ? createUtcDate(input) : createDate(config.env.date, input);
    double expectedWeekday = JsDate.weekDay(config.useUtc ? config.d : config.env.date.localTime(config.d));

    if (config.tzm != null) {
      config.d = JsDate.setUtcMinutes(config.d, JsDate.minFromTime(config.d) - config.tzm);
    }

    if (config.nextDay) {
      a[HOUR] = 24.0;
    }

    if (config.w != null && config.w.containsKey("d") && config.w.get("d") != expectedWeekday) {
      config.weekdayMismatch = true;
    }
  }

  private static void dayOfYearFromWeekInfo(Config config) {
    Map<String, Double> w = config.w;
    Double[] a = config.a;
    double weekYear;
    double week;
    double weekday;
    int dow;
    int doy;
    boolean weekdayOverflow = false;
    if (w.get("GG") != null || w.get("W") != null || w.get("E") != null) {
      dow = 1;
      doy = 4;
      double[] nowWeek = weekOfYear(now(config.env), 1, 4);
      weekYear = w.get("GG") != null ? w.get("GG") : a[YEAR] != null ? a[YEAR] : nowWeek[1];
      week = w.get("W") != null ? w.get("W") : 1;
      weekday = w.get("E") != null ? w.get("E") : 1;
      if (weekday < 1 || weekday > 7) {
        weekdayOverflow = true;
      }
    } else {
      dow = WEEK_DOW;
      doy = WEEK_DOY;
      double[] curWeek = weekOfYear(now(config.env), dow, doy);
      weekYear = w.get("gg") != null ? w.get("gg") : a[YEAR] != null ? a[YEAR] : curWeek[1];
      week = w.get("w") != null ? w.get("w") : curWeek[0];
      if (w.get("d") != null) {
        weekday = w.get("d");
        if (weekday < 0 || weekday > 6) {
          weekdayOverflow = true;
        }
      } else if (w.get("e") != null) {
        weekday = w.get("e") + dow;
        if (w.get("e") < 0 || w.get("e") > 6) {
          weekdayOverflow = true;
        }
      } else {
        weekday = dow;
      }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
      config.overflowWeeks = true;
    } else if (weekdayOverflow) {
      config.overflowWeekday = true;
    } else {
      double[] temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
      a[YEAR] = temp[0];
      config.dayOfYear = temp[1];
    }
  }

  private static void checkOverflow(Config config) {
    Double[] a = config.a;
    if (a == null || config.overflow != -2) {
      return;
    }
    int overflow;
    if (lt(a[MONTH], 0) || gt(a[MONTH], 11)) {
      overflow = MONTH;
    } else if (lt(a[DATE], 1) || gt(a[DATE], daysInMonth(num(a[YEAR]), num(a[MONTH])))) {
      overflow = DATE;
    } else if (lt(a[HOUR], 0) || gt(a[HOUR], 24)
      || (a[HOUR] != null && a[HOUR] == 24 && (!eq(a[MINUTE], 0) || !eq(a[SECOND], 0) || !eq(a[MILLISECOND], 0)))) {
      overflow = HOUR;
    } else if (lt(a[MINUTE], 0) || gt(a[MINUTE], 59)) {
      overflow = MINUTE;
    } else if (lt(a[SECOND], 0) || gt(a[SECOND], 59)) {
      overflow = SECOND;
    } else if (lt(a[MILLISECOND], 0) || gt(a[MILLISECOND], 999)) {
      overflow = MILLISECOND;
    } else {
      overflow = -1;
    }
    if (config.overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
      overflow = DATE;
    }
    if (config.overflowWeeks && overflow == -1) {
      overflow = WEEK;
    }
    if (config.overflowWeekday && overflow == -1) {
      overflow = WEEKDAY;
    }
    config.overflow = overflow;
  }

  private static boolean lt(Double x, double v) {
    return x != null && x < v;
  }

  private static boolean gt(Double x, double v) {
    return x != null && x > v;
  }

  private static boolean eq(Double x, double v) {
    return x != null && x == v;
  }

  private static double num(Double x) {
    return x == null ? Double.NaN : x;
  }

  private static double createDate(JsDate jsDate, Double[] input) {
    double y = input[0];
    double date;
    if (y < 100 && y >= 0) {
      date = jsDate.construct(y + 400, input[1], input[2], input[3], input[4], input[5], input[6]);
      if (JsDate.isFinite(JsDate.yearFromTime(jsDate.localTime(date)))) {
        date = jsDate.setFullYear(date, y);
      }
    } else {
      date = jsDate.construct(y, input[1], input[2], input[3], input[4], input[5], input[6]);
    }
    return date;
  }

  /** moment's createUTCDate with Date.UTC defaults for missing arguments. */
  private static double createUtcDate(Double... args) {
    double[] full = {Double.NaN, 0, 1, 0, 0, 0, 0};
    for (int i = 0; i < Math.min(args.length, 7); i++) {
      full[i] = args[i] == null ? Double.NaN : args[i];
    }
    double y = full[0];
    double date;
    if (y < 100 && y >= 0) {
      date = JsDate.constructUtc(y + 400, full[1], full[2], full[3], full[4], full[5], full[6]);
      if (JsDate.isFinite(JsDate.yearFromTime(date))) {
        date = JsDate.setUtcFullYear(date, y);
      }
    } else {
      date = JsDate.constructUtc(y, full[1], full[2], full[3], full[4], full[5], full[6]);
    }
    return date;
  }

  // ---- calendar helpers ----

  static boolean isLeapYear(double year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  static double daysInYear(double year) {
    return isLeapYear(year) ? 366 : 365;
  }

  static double daysInMonth(double year, double month) {
    if (Double.isNaN(year) || Double.isNaN(month)) {
      return Double.NaN;
    }
    double modMonth = ((month % 12) + 12) % 12;
    year += (month - modMonth) / 12;
    return modMonth == 1 ? (isLeapYear(year) ? 29 : 28) : 31 - ((modMonth % 7) % 2);
  }

  private static double firstWeekOffset(double year, int dow, int doy) {
    double fwd = 7 + dow - doy;
    double fwdlw = (7 + JsDate.weekDay(createUtcDate(year, 0.0, fwd)) - dow) % 7;
    return -fwdlw + fwd - 1;
  }

  private static double[] dayOfYearFromWeeks(double year, double week, double weekday, int dow, int doy) {
    double localWeekday = (7 + weekday - dow) % 7;
    double weekOffset = firstWeekOffset(year, dow, doy);
    double dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset;
    double resYear;
    double resDayOfYear;
    if (dayOfYear <= 0) {
      resYear = year - 1;
      resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
      resYear = year + 1;
      resDayOfYear = dayOfYear - daysInYear(year);
    } else {
      resYear = year;
      resDayOfYear = dayOfYear;
    }
    return new double[] {resYear, resDayOfYear};
  }

  /** {week, year} */
  private static double[] weekOfYear(Moment mom, int dow, int doy) {
    double weekOffset = firstWeekOffset(mom.year(), dow, doy);
    double week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1;
    if (week < 1) {
      double resYear = mom.year() - 1;
      return new double[] {week + weeksInYear(resYear, dow, doy), resYear};
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
      return new double[] {week - weeksInYear(mom.year(), dow, doy), mom.year() + 1};
    }
    return new double[] {week, mom.year()};
  }

  private static double weeksInYear(double year, int dow, int doy) {
    double weekOffset = firstWeekOffset(year, dow, doy);
    double weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
  }

  // ---- number helpers ----

  /** moment's toInt. */
  static double toInt(Object value) {
    double coerced = JsValues.toNumber(value == null ? com.cermati.satpam.Undefined.INSTANCE : value);
    if (coerced != 0 && JsDate.isFinite(coerced)) {
      return absFloor(coerced);
    }
    return 0;
  }

  private static double absFloor(double number) {
    if (number < 0) {
      double c = Math.ceil(number);
      return c == 0 ? 0 : c;
    }
    return Math.floor(number);
  }

  /** JS Math.round. */
  static double jsRound(double x) {
    if (!JsDate.isFinite(x)) {
      return x;
    }
    double r = Math.floor(x);
    if (x - r >= 0.5) {
      r += 1;
    }
    return r == 0 && (x < 0 || 1 / x < 0) ? -0.0 : r;
  }

  private static double absRound(double number) {
    return number < 0 ? jsRound(-1 * number) * -1 : jsRound(number);
  }

  /** JS parseInt(string, 10). */
  static double parseInt(String s) {
    String t = JsValues.trim(s);
    int i = 0;
    boolean negative = false;
    if (i < t.length() && (t.charAt(i) == '+' || t.charAt(i) == '-')) {
      negative = t.charAt(i) == '-';
      i++;
    }
    int start = i;
    while (i < t.length() && t.charAt(i) >= '0' && t.charAt(i) <= '9') {
      i++;
    }
    if (i == start) {
      return Double.NaN;
    }
    double value = Double.parseDouble(t.substring(start, i));
    return negative ? -value : value;
  }

  /** JS parseFloat. */
  static double parseFloat(String s) {
    String t = JsValues.trim(s);
    Matcher m = Pattern.compile("^[+-]?(Infinity|(\\d+\\.?\\d*|\\.\\d+)([eE][+-]?\\d+)?)").matcher(t);
    if (!m.find()) {
      return Double.NaN;
    }
    String number = m.group();
    if (number.endsWith("Infinity")) {
      return number.startsWith("-") ? Double.NEGATIVE_INFINITY : Double.POSITIVE_INFINITY;
    }
    return Double.parseDouble(number);
  }

  // ======================================================================================
  // Units
  // ======================================================================================

  private static final Map<String, String> ALIASES = new HashMap<>();

  private static void alias(String unit, String shorthand) {
    String lower = unit.toLowerCase(java.util.Locale.ROOT);
    ALIASES.put(lower, unit);
    ALIASES.put(lower + "s", unit);
    ALIASES.put(shorthand, unit);
  }

  static {
    alias("month", "M");
    alias("year", "y");
    alias("week", "w");
    alias("isoWeek", "W");
    alias("day", "d");
    alias("weekday", "e");
    alias("isoWeekday", "E");
    alias("hour", "h");
    alias("weekYear", "gg");
    alias("isoWeekYear", "GG");
    alias("quarter", "Q");
    alias("date", "D");
    alias("dayOfYear", "DDD");
    alias("minute", "m");
    alias("second", "s");
    alias("millisecond", "ms");
  }

  /** moment's normalizeUnits; {@code null} for undefined. */
  static String normalizeUnits(Object units) {
    if (!(units instanceof String)) {
      return null;
    }
    String u = (String) units;
    String unit = ALIASES.get(u);
    return unit != null ? unit : ALIASES.get(u.toLowerCase(java.util.Locale.ROOT));
  }

  // ======================================================================================
  // Getters
  // ======================================================================================

  public boolean isValid() {
    return valid;
  }

  public double valueOf() {
    return d - offset * 60000;
  }

  private double fieldTime() {
    return isUtc ? d : env.date.localTime(d);
  }

  public double year() {
    return valid ? JsDate.yearFromTime(fieldTime()) : Double.NaN;
  }

  public double month() {
    return valid ? JsDate.monthFromTime(fieldTime()) : Double.NaN;
  }

  public double date() {
    return valid ? JsDate.dateFromTime(fieldTime()) : Double.NaN;
  }

  public double day() {
    return valid ? JsDate.weekDay(fieldTime()) : Double.NaN;
  }

  double hours() {
    return valid ? JsDate.hourFromTime(fieldTime()) : Double.NaN;
  }

  double minutes() {
    return valid ? JsDate.minFromTime(fieldTime()) : Double.NaN;
  }

  double seconds() {
    return valid ? JsDate.secFromTime(fieldTime()) : Double.NaN;
  }

  double milliseconds() {
    return valid ? JsDate.msFromTime(fieldTime()) : Double.NaN;
  }

  private double weekday() {
    return valid ? (day() + 7 - WEEK_DOW) % 7 : Double.NaN;
  }

  private double isoWeekday() {
    if (!valid) {
      return Double.NaN;
    }
    double day = day();
    return day == 0 || Double.isNaN(day) ? 7 : day;
  }

  private double dayOfYear() {
    return jsRound((copy().startOf("day").valueOf() - copy().startOf("year").valueOf()) / JsDate.MS_PER_DAY) + 1;
  }

  /** {@code utcOffset()} getter in minutes. */
  public double utcOffset() {
    if (!valid) {
      return Double.NaN;
    }
    return isUtc ? offset : -jsRound(env.date.timezoneOffset(d));
  }

  // ======================================================================================
  // Manipulation
  // ======================================================================================

  public Moment add(Object val, Object period) {
    return addOrSubtract(val, period, 1);
  }

  public Moment subtract(Object val, Object period) {
    return addOrSubtract(val, period, -1);
  }

  private Moment addOrSubtract(Object val, Object period, int direction) {
    // createAdder swaps (period, number) calls, with a deprecation warning
    if (period != null && !Double.isNaN(JsValues.toNumber(period))) {
      Object tmp = val;
      val = period;
      period = tmp;
    }
    addSubtract(createDuration(val, period), direction);
    return this;
  }

  /** {milliseconds, days, months} of moment.duration(input, key) for a numeric input. */
  private static double[] createDuration(Object input, Object key) {
    double value = JsValues.toNumber(input);
    if (!(input instanceof Double) && Double.isNaN(value)) {
      // Non-numeric durations (ASP.NET / ISO strings) are not reachable from satpam rules
      return new double[] {0, 0, 0};
    }
    String unit = JsValues.truthy(key) ? normalizeUnits(JsValues.toJsString(key)) : "millisecond";
    double[] duration = {0, 0, 0};
    if (unit == null) {
      return duration;
    }
    switch (unit) {
      case "year":
        duration[2] = value * 12;
        break;
      case "quarter":
        duration[2] = value * 3;
        break;
      case "month":
        duration[2] = value;
        break;
      case "week":
      case "isoWeek":
        duration[1] = value * 7;
        break;
      case "day":
        duration[1] = value;
        break;
      case "hour":
        duration[0] = value * 1000 * 60 * 60;
        break;
      case "minute":
        duration[0] = value * 6e4;
        break;
      case "second":
        duration[0] = value * 1e3;
        break;
      case "millisecond":
        duration[0] = value;
        break;
      default:
        break;
    }
    return duration;
  }

  private void addSubtract(double[] duration, int isAdding) {
    double milliseconds = duration[0];
    double days = absRound(duration[1]);
    double months = absRound(duration[2]);
    if (!valid) {
      return;
    }
    if (truthy(months)) {
      setMonth(month() + months * isAdding);
    }
    if (truthy(days)) {
      double value = date() + days * isAdding;
      if (!Double.isNaN(value)) {
        d = isUtc ? JsDate.setUtcDate(d, value) : env.date.setDate(d, value);
      }
    }
    if (truthy(milliseconds)) {
      d = JsDate.timeClip(d + milliseconds * isAdding);
    }
  }

  private static boolean truthy(double d) {
    return d != 0 && !Double.isNaN(d);
  }

  private void setMonth(double value) {
    double dayOfMonth = Math.min(date(), daysInMonth(year(), value));
    d = isUtc ? JsDate.setUtcMonth(d, value, dayOfMonth) : env.date.setMonth(d, value, dayOfMonth);
  }

  private double startOfDate(double y, double m, double dt) {
    if (isUtc) {
      if (y < 100 && y >= 0) {
        return JsDate.constructUtc(y + 400, m, dt, 0, 0, 0, 0) - MS_PER_400_YEARS;
      }
      return JsDate.constructUtc(y, m, dt, 0, 0, 0, 0);
    }
    if (y < 100 && y >= 0) {
      return env.date.construct(y + 400, m, dt, 0, 0, 0, 0) - MS_PER_400_YEARS;
    }
    return env.date.construct(y, m, dt, 0, 0, 0, 0);
  }

  public Moment startOf(Object units) {
    String unit = normalizeUnits(units);
    if (unit == null || unit.equals("millisecond") || !valid) {
      return this;
    }
    double time;
    switch (unit) {
      case "year":
        time = startOfDate(year(), 0, 1);
        break;
      case "quarter":
        time = startOfDate(year(), month() - (month() % 3), 1);
        break;
      case "month":
        time = startOfDate(year(), month(), 1);
        break;
      case "week":
        time = startOfDate(year(), month(), date() - weekday());
        break;
      case "isoWeek":
        time = startOfDate(year(), month(), date() - (isoWeekday() - 1));
        break;
      case "day":
      case "date":
        time = startOfDate(year(), month(), date());
        break;
      case "hour":
        time = d;
        time -= mod(time + (isUtc ? 0 : utcOffset() * JsDate.MS_PER_MINUTE), JsDate.MS_PER_HOUR);
        break;
      case "minute":
        time = d;
        time -= mod(time, JsDate.MS_PER_MINUTE);
        break;
      case "second":
        time = d;
        time -= mod(time, JsDate.MS_PER_SECOND);
        break;
      default:
        // _d.setTime(undefined)
        time = Double.NaN;
        break;
    }
    d = JsDate.timeClip(time);
    return this;
  }

  public Moment endOf(Object units) {
    String unit = normalizeUnits(units);
    if (unit == null || unit.equals("millisecond") || !valid) {
      return this;
    }
    double time;
    switch (unit) {
      case "year":
        time = startOfDate(year() + 1, 0, 1) - 1;
        break;
      case "quarter":
        time = startOfDate(year(), month() - (month() % 3) + 3, 1) - 1;
        break;
      case "month":
        time = startOfDate(year(), month() + 1, 1) - 1;
        break;
      case "week":
        time = startOfDate(year(), month(), date() - weekday() + 7) - 1;
        break;
      case "isoWeek":
        time = startOfDate(year(), month(), date() - (isoWeekday() - 1) + 7) - 1;
        break;
      case "day":
      case "date":
        time = startOfDate(year(), month(), date() + 1) - 1;
        break;
      case "hour":
        time = d;
        time += JsDate.MS_PER_HOUR - mod(time + (isUtc ? 0 : utcOffset() * JsDate.MS_PER_MINUTE), JsDate.MS_PER_HOUR) - 1;
        break;
      case "minute":
        time = d;
        time += JsDate.MS_PER_MINUTE - mod(time, JsDate.MS_PER_MINUTE) - 1;
        break;
      case "second":
        time = d;
        time += JsDate.MS_PER_SECOND - mod(time, JsDate.MS_PER_SECOND) - 1;
        break;
      default:
        time = Double.NaN;
        break;
    }
    d = JsDate.timeClip(time);
    return this;
  }

  private static double mod(double dividend, double divisor) {
    return ((dividend % divisor) + divisor) % divisor;
  }

  /** {@code utcOffset(input)} setter with a number of hours (|input| &lt; 16) or minutes. */
  public Moment utcOffset(double input) {
    if (!valid) {
      return this;
    }
    double previous = offset;
    if (Math.abs(input) < 16) {
      input = input * 60;
    }
    offset = input;
    isUtc = true;
    if (previous != input) {
      double[] duration = createDuration(input - previous, "m");
      double ms = duration[0];
      if (truthy(ms)) {
        d = JsDate.timeClip(d + ms);
      }
    }
    return this;
  }

  // ======================================================================================
  // Comparison
  // ======================================================================================

  public boolean isAfter(Moment input, Object units) {
    if (!(valid && input.valid)) {
      return false;
    }
    String unit = normalizeUnits(units);
    if (unit == null || unit.equals("millisecond")) {
      return valueOf() > input.valueOf();
    }
    return input.valueOf() < copy().startOf(unit).valueOf();
  }

  public boolean isBefore(Moment input, Object units) {
    if (!(valid && input.valid)) {
      return false;
    }
    String unit = normalizeUnits(units);
    if (unit == null || unit.equals("millisecond")) {
      return valueOf() < input.valueOf();
    }
    return copy().endOf(unit).valueOf() < input.valueOf();
  }

  public boolean isSame(Moment input, Object units) {
    if (!(valid && input.valid)) {
      return false;
    }
    String unit = normalizeUnits(units);
    if (unit == null || unit.equals("millisecond")) {
      return valueOf() == input.valueOf();
    }
    double inputMs = input.valueOf();
    return copy().startOf(unit).valueOf() <= inputMs && inputMs <= copy().endOf(unit).valueOf();
  }

  public boolean isSameOrAfter(Moment input, Object units) {
    return isSame(input, units) || isAfter(input, units);
  }

  public boolean isSameOrBefore(Moment input, Object units) {
    return isSame(input, units) || isBefore(input, units);
  }

  /** {@code this.diff(input, units)} (not as float). */
  public double diff(Moment input, Object units) {
    if (!valid) {
      return Double.NaN;
    }
    // cloneWithOffset for a local moment: createLocal(input).local()
    Moment that = input.copy();
    if (!that.valid) {
      return Double.NaN;
    }
    double zoneDelta = (that.utcOffset() - utcOffset()) * 6e4;
    String unit = normalizeUnits(units);
    double output;
    switch (unit == null ? "" : unit) {
      case "year":
        output = monthDiff(this, that) / 12;
        break;
      case "month":
        output = monthDiff(this, that);
        break;
      case "quarter":
        output = monthDiff(this, that) / 3;
        break;
      case "second":
        output = (valueOf() - that.valueOf()) / 1e3;
        break;
      case "minute":
        output = (valueOf() - that.valueOf()) / 6e4;
        break;
      case "hour":
        output = (valueOf() - that.valueOf()) / 36e5;
        break;
      case "day":
        output = (valueOf() - that.valueOf() - zoneDelta) / 864e5;
        break;
      case "week":
        output = (valueOf() - that.valueOf() - zoneDelta) / 6048e5;
        break;
      default:
        output = valueOf() - that.valueOf();
        break;
    }
    return absFloor(output);
  }

  private static double monthDiff(Moment a, Moment b) {
    if (a.date() < b.date()) {
      return -monthDiff(b, a);
    }
    double wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
    Moment anchor = a.copy().add(wholeMonthDiff, "months");
    Moment anchor2;
    double adjust;
    if (b.valueOf() - anchor.valueOf() < 0) {
      anchor2 = a.copy().add(wholeMonthDiff - 1, "months");
      adjust = (b.valueOf() - anchor.valueOf()) / (anchor.valueOf() - anchor2.valueOf());
    } else {
      anchor2 = a.copy().add(wholeMonthDiff + 1, "months");
      adjust = (b.valueOf() - anchor.valueOf()) / (anchor2.valueOf() - anchor.valueOf());
    }
    double result = -(wholeMonthDiff + adjust);
    return result == 0 || Double.isNaN(result) ? 0 : result;
  }

  // ======================================================================================
  // Formatting
  // ======================================================================================

  /**
   * {@code format(format)} for the numeric tokens satpam uses ({@code YYYY YY MM M DD D HH H hh h
   * mm m ss s SSS Z ZZ A a}) plus {@code [literal]} text.
   */
  public String format(String format) {
    if (!valid) {
      return INVALID_DATE;
    }
    StringBuilder out = new StringBuilder();
    for (String token : formatTokens(format)) {
      out.append(formatToken(token));
    }
    return out.toString();
  }

  private String formatToken(String token) {
    switch (token) {
      case "YYYY":
        return zeroFill(year(), 4, false);
      case "YY":
        return zeroFill(year() % 100, 2, false);
      case "MM":
        return zeroFill(month() + 1, 2, false);
      case "M":
        return num(month() + 1);
      case "DD":
        return zeroFill(date(), 2, false);
      case "D":
        return num(date());
      case "HH":
        return zeroFill(hours(), 2, false);
      case "H":
        return num(hours());
      case "hh":
        return zeroFill(hours() % 12 == 0 ? 12 : hours() % 12, 2, false);
      case "h":
        return num(hours() % 12 == 0 ? 12 : hours() % 12);
      case "mm":
        return zeroFill(minutes(), 2, false);
      case "m":
        return num(minutes());
      case "ss":
        return zeroFill(seconds(), 2, false);
      case "s":
        return num(seconds());
      case "SSS":
        return zeroFill(milliseconds(), 3, false);
      case "A":
        return hours() > 11 ? "PM" : "AM";
      case "a":
        return hours() > 11 ? "pm" : "am";
      case "Z":
      case "ZZ": {
        double off = utcOffset();
        String sign = "+";
        if (off < 0) {
          off = -off;
          sign = "-";
        }
        return sign + zeroFill((int) (off / 60), 2, false) + (token.equals("Z") ? ":" : "") + zeroFill((int) off % 60, 2, false);
      }
      default:
        if (FORMAT_TOKENS.contains(token)) {
          throw new IllegalStateException("moment format token not implemented: " + token);
        }
        // removeFormattingTokens
        if (BRACKET_START.pattern().matcher(token).find()) {
          return token.replaceAll("^\\[|\\]$", "");
        }
        return token.replace("\\", "");
    }
  }

  private static String num(double d) {
    return JsValues.numberToString(d);
  }

  private static String zeroFill(double number, int targetLength, boolean forceSign) {
    String absNumber = JsValues.numberToString(Math.abs(number));
    int zerosToFill = targetLength - absNumber.length();
    boolean sign = number >= 0;
    StringBuilder sb = new StringBuilder((sign ? (forceSign ? "+" : "") : "-"));
    for (int i = 0; i < zerosToFill; i++) {
      sb.append('0');
    }
    return sb.append(absNumber).toString();
  }
}
