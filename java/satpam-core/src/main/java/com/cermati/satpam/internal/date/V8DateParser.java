package com.cermati.satpam.internal.date;

/**
 * Port of V8 13.6's {@code DateParser} ({@code src/date/dateparser*}), which Node 24 uses for
 * {@code new Date(string)}: ES5 ISO date-time strings first, then the legacy Safari-compatible
 * format ("Jan 2 2020 10:00 GMT+0700", "2020/01/02", ...). moment falls back to it for strings
 * that are neither ISO 8601 nor RFC 2822.
 */
final class V8DateParser {
  private static final int NONE = Integer.MAX_VALUE;
  private static final int MAX_SIGNIFICANT_DIGITS = 9;
  /** Smi range of a 64-bit V8 without pointer compression (Node's default build). */
  private static final long SMI_MAX = Integer.MAX_VALUE;

  private V8DateParser() {
  }

  static double parse(String str, JsDate date) {
    double[] out = new double[8];
    if (!new Parser(str).parse(out)) {
      return Double.NaN;
    }
    double day = JsDate.makeDay(out[0], out[1], out[2]);
    double time = JsDate.makeTime(out[3], out[4], out[5], out[6]);
    double value = JsDate.makeDate(day, time);
    if (Double.isNaN(out[7])) {
      value = date.utc(value);
    } else {
      value -= out[7] * 1000.0;
    }
    return JsDate.timeClip(value);
  }

  static boolean between(int x, int lo, int hi) {
    return Integer.compareUnsigned(x - lo, hi - lo) <= 0;
  }

  // ---- character classes (V8 char-predicates) ----

  static boolean isWhiteSpace(int c) {
    switch (c) {
      case 0x09:
      case 0x0B:
      case 0x0C:
      case 0x20:
      case 0xA0:
      case 0x1680:
      case 0x202F:
      case 0x205F:
      case 0x3000:
      case 0xFEFF:
        return true;
      default:
        return c >= 0x2000 && c <= 0x200A;
    }
  }

  static boolean isWhiteSpaceOrLineTerminator(int c) {
    return isWhiteSpace(c) || c == 0x0A || c == 0x0D || c == 0x2028 || c == 0x2029;
  }

  // ---- input reader ----

  private static final class InputReader {
    private final String buffer;
    private int index;
    private int ch;

    InputReader(String s) {
      this.buffer = s;
      next();
    }

    int position() {
      return index;
    }

    void next() {
      ch = index < buffer.length() ? buffer.charAt(index) : 0;
      index++;
    }

    int readUnsignedNumeral() {
      int n = 0;
      int i = 0;
      while (ch == '0') {
        next();
      }
      while (isAsciiDigit()) {
        if (i < MAX_SIGNIFICANT_DIGITS) {
          n = n * 10 + ch - '0';
        }
        i++;
        next();
      }
      return n;
    }

    int readWord(int[] prefix) {
      int len;
      for (len = 0; isAsciiAlphaOrAbove() && !isWhiteSpaceChar(); next(), len++) {
        if (len < prefix.length) {
          prefix[len] = ch | 0x20;
        }
      }
      for (int i = len; i < prefix.length; i++) {
        prefix[i] = 0;
      }
      return len;
    }

    boolean skip(int c) {
      if (ch == c) {
        next();
        return true;
      }
      return false;
    }

    boolean skipWhiteSpace() {
      if (isWhiteSpaceOrLineTerminator(ch)) {
        next();
        return true;
      }
      return false;
    }

    boolean skipParentheses() {
      if (ch != '(') {
        return false;
      }
      int balance = 0;
      do {
        if (ch == ')') {
          --balance;
        } else if (ch == '(') {
          ++balance;
        }
        next();
      } while (balance > 0 && ch != 0);
      return true;
    }

    boolean isEnd() {
      return ch == 0;
    }

    boolean isAsciiDigit() {
      return ch >= '0' && ch <= '9';
    }

    boolean isAsciiAlphaOrAbove() {
      return ch >= 'A';
    }

    boolean isWhiteSpaceChar() {
      return isWhiteSpace(ch);
    }
  }

  // ---- tokens ----

  private static final int INVALID = 0;
  private static final int MONTH_NAME = 1;
  private static final int TIME_ZONE_NAME = 2;
  private static final int TIME_SEPARATOR = 3;
  private static final int AM_PM = 4;

  private static final int TAG_INVALID = -6;
  private static final int TAG_UNKNOWN = -5;
  private static final int TAG_WHITESPACE = -4;
  private static final int TAG_NUMBER = -3;
  private static final int TAG_SYMBOL = -2;
  private static final int TAG_END = -1;

  private static final class DateToken {
    final int tag;
    final int length;
    final int value;

    DateToken(int tag, int length, int value) {
      this.tag = tag;
      this.length = length;
      this.value = value;
    }

    boolean isInvalid() {
      return tag == TAG_INVALID;
    }

    boolean isNumber() {
      return tag == TAG_NUMBER;
    }

    boolean isSymbol() {
      return tag == TAG_SYMBOL;
    }

    boolean isWhiteSpace() {
      return tag == TAG_WHITESPACE;
    }

    boolean isEndOfInput() {
      return tag == TAG_END;
    }

    boolean isKeyword() {
      return tag >= 0;
    }

    boolean isSymbol(char symbol) {
      return isSymbol() && value == symbol;
    }

    boolean isKeywordType(int type) {
      return tag == type;
    }

    boolean isFixedLengthNumber(int len) {
      return isNumber() && length == len;
    }

    boolean isAsciiSign() {
      return tag == TAG_SYMBOL && (value == '-' || value == '+');
    }

    int asciiSign() {
      return 44 - value;
    }

    boolean isKeywordZ() {
      return isKeywordType(TIME_ZONE_NAME) && length == 1 && value == 0;
    }

    static DateToken number(int value, int length) {
      return new DateToken(TAG_NUMBER, length, value);
    }

    static DateToken symbol(char symbol) {
      return new DateToken(TAG_SYMBOL, 1, symbol);
    }

    static final DateToken END = new DateToken(TAG_END, 0, -1);
    static final DateToken UNKNOWN = new DateToken(TAG_UNKNOWN, 1, -1);
    static final DateToken INVALID_TOKEN = new DateToken(TAG_INVALID, 0, -1);
  }

  /** {prefix (3 chars), type, value} */
  private static final Object[][] KEYWORDS = {
    {"jan", MONTH_NAME, 1}, {"feb", MONTH_NAME, 2}, {"mar", MONTH_NAME, 3}, {"apr", MONTH_NAME, 4},
    {"may", MONTH_NAME, 5}, {"jun", MONTH_NAME, 6}, {"jul", MONTH_NAME, 7}, {"aug", MONTH_NAME, 8},
    {"sep", MONTH_NAME, 9}, {"oct", MONTH_NAME, 10}, {"nov", MONTH_NAME, 11}, {"dec", MONTH_NAME, 12},
    {"am\0", AM_PM, 0}, {"pm\0", AM_PM, 12},
    {"ut\0", TIME_ZONE_NAME, 0}, {"utc", TIME_ZONE_NAME, 0}, {"z\0\0", TIME_ZONE_NAME, 0},
    {"gmt", TIME_ZONE_NAME, 0}, {"cdt", TIME_ZONE_NAME, -5}, {"cst", TIME_ZONE_NAME, -6},
    {"edt", TIME_ZONE_NAME, -4}, {"est", TIME_ZONE_NAME, -5}, {"mdt", TIME_ZONE_NAME, -6},
    {"mst", TIME_ZONE_NAME, -7}, {"pdt", TIME_ZONE_NAME, -7}, {"pst", TIME_ZONE_NAME, -8},
    {"t\0\0", TIME_SEPARATOR, 0},
  };

  private static DateToken keyword(int[] prefix, int len) {
    for (Object[] entry : KEYWORDS) {
      String key = (String) entry[0];
      int j = 0;
      while (j < 3 && prefix[j] == key.charAt(j)) {
        j++;
      }
      int type = (Integer) entry[1];
      if (j == 3 && (len <= 3 || type == MONTH_NAME)) {
        return new DateToken(type, len, (Integer) entry[2]);
      }
    }
    return new DateToken(INVALID, len, 0);
  }

  private static final class Tokenizer {
    private final InputReader in;
    private DateToken next;

    Tokenizer(InputReader in) {
      this.in = in;
      this.next = scan();
    }

    DateToken next() {
      DateToken result = next;
      next = scan();
      return result;
    }

    DateToken peek() {
      return next;
    }

    boolean skipSymbol(char symbol) {
      if (next.isSymbol(symbol)) {
        next = scan();
        return true;
      }
      return false;
    }

    private DateToken scan() {
      int prePos = in.position();
      if (in.isEnd()) {
        return DateToken.END;
      }
      if (in.isAsciiDigit()) {
        int n = in.readUnsignedNumeral();
        return DateToken.number(n, in.position() - prePos);
      }
      if (in.skip(':')) {
        return DateToken.symbol(':');
      }
      if (in.skip('-')) {
        return DateToken.symbol('-');
      }
      if (in.skip('+')) {
        return DateToken.symbol('+');
      }
      if (in.skip('.')) {
        return DateToken.symbol('.');
      }
      if (in.skip(')')) {
        return DateToken.symbol(')');
      }
      if (in.isAsciiAlphaOrAbove() && !in.isWhiteSpaceChar()) {
        int[] buffer = new int[3];
        int length = in.readWord(buffer);
        return keyword(buffer, length);
      }
      if (in.skipWhiteSpace()) {
        return new DateToken(TAG_WHITESPACE, in.position() - prePos, -1);
      }
      if (in.skipParentheses()) {
        return DateToken.UNKNOWN;
      }
      in.next();
      return DateToken.UNKNOWN;
    }
  }

  private static int readMilliseconds(DateToken token) {
    int number = token.value;
    int length = token.length;
    if (length < 3) {
      if (length == 1) {
        number *= 100;
      } else if (length == 2) {
        number *= 10;
      }
    } else if (length > 3) {
      if (length > MAX_SIGNIFICANT_DIGITS) {
        length = MAX_SIGNIFICANT_DIGITS;
      }
      int factor = 1;
      do {
        factor *= 10;
        length--;
      } while (length > 3);
      number /= factor;
    }
    return number;
  }

  // ---- composers ----

  private static final class TimeZoneComposer {
    int sign = NONE;
    int hour = NONE;
    int minute = NONE;

    void set(int offsetInHours) {
      sign = offsetInHours < 0 ? -1 : 1;
      hour = offsetInHours * sign;
      minute = 0;
    }

    void setSign(int s) {
      sign = s < 0 ? -1 : 1;
    }

    boolean isExpecting(int n) {
      return hour != NONE && minute == NONE && TimeComposer.isMinute(n);
    }

    boolean isUtc() {
      return hour == 0 && minute == 0;
    }

    boolean isEmpty() {
      return hour == NONE;
    }

    boolean write(double[] output) {
      if (sign != NONE) {
        if (hour == NONE) {
          hour = 0;
        }
        if (minute == NONE) {
          minute = 0;
        }
        // unsigned 32-bit arithmetic, as in V8
        long totalUnsigned = ((hour & 0xFFFFFFFFL) * 3600L + (minute & 0xFFFFFFFFL) * 60L) & 0xFFFFFFFFL;
        if (totalUnsigned > SMI_MAX) {
          return false;
        }
        int total = (int) totalUnsigned;
        if (sign < 0) {
          total = -total;
        }
        output[7] = total;
      } else {
        output[7] = Double.NaN;
      }
      return true;
    }
  }

  private static final class TimeComposer {
    private static final int SIZE = 4;
    final int[] comp = new int[SIZE];
    int index;
    int hourOffset = NONE;

    boolean isEmpty() {
      return index == 0;
    }

    boolean isExpecting(int n) {
      return (index == 1 && isMinute(n)) || (index == 2 && isSecond(n)) || (index == 3 && isMillisecond(n));
    }

    boolean add(int n) {
      if (index < SIZE) {
        comp[index++] = n;
        return true;
      }
      return false;
    }

    boolean addFinal(int n) {
      if (!add(n)) {
        return false;
      }
      while (index < SIZE) {
        comp[index++] = 0;
      }
      return true;
    }

    boolean write(double[] output) {
      while (index < SIZE) {
        comp[index++] = 0;
      }
      int hour = comp[0];
      int minute = comp[1];
      int second = comp[2];
      int millisecond = comp[3];
      if (hourOffset != NONE) {
        if (!between(hour, 0, 12)) {
          return false;
        }
        hour %= 12;
        hour += hourOffset;
      }
      if (!isHour(hour) || !isMinute(minute) || !isSecond(second) || !isMillisecond(millisecond)) {
        if (hour != 24 || minute != 0 || second != 0 || millisecond != 0) {
          return false;
        }
      }
      output[3] = hour;
      output[4] = minute;
      output[5] = second;
      output[6] = millisecond;
      return true;
    }

    static boolean isMinute(int x) {
      return between(x, 0, 59);
    }

    static boolean isHour(int x) {
      return between(x, 0, 23);
    }

    static boolean isSecond(int x) {
      return between(x, 0, 59);
    }

    static boolean isMillisecond(int x) {
      return between(x, 0, 999);
    }
  }

  private static final class DayComposer {
    private static final int SIZE = 3;
    final int[] comp = new int[SIZE];
    int index;
    int namedMonth = NONE;
    boolean isIsoDate;

    boolean isEmpty() {
      return index == 0;
    }

    boolean add(int n) {
      if (index < SIZE) {
        comp[index++] = n;
        return true;
      }
      return false;
    }

    boolean write(double[] output) {
      if (index < 1) {
        return false;
      }
      while (index < SIZE) {
        comp[index++] = 1;
      }
      int year = 0;
      int month;
      int day;
      if (namedMonth == NONE) {
        if (isIsoDate || (index == 3 && !isDay(comp[0]))) {
          year = comp[0];
          month = comp[1];
          day = comp[2];
        } else {
          month = comp[0];
          day = comp[1];
          if (index == 3) {
            year = comp[2];
          }
        }
      } else {
        month = namedMonth;
        if (index == 1) {
          day = comp[0];
        } else if (!isDay(comp[0])) {
          year = comp[0];
          day = comp[1];
        } else {
          day = comp[0];
          year = comp[1];
        }
      }
      if (!isIsoDate) {
        if (between(year, 0, 49)) {
          year += 2000;
        } else if (between(year, 50, 99)) {
          year += 1900;
        }
      }
      if (!isMonth(month) || !isDay(day)) {
        return false;
      }
      output[0] = year;
      output[1] = month - 1;
      output[2] = day;
      return true;
    }

    static boolean isMonth(int x) {
      return between(x, 1, 12);
    }

    static boolean isDay(int x) {
      return between(x, 1, 31);
    }
  }

  // ---- parser ----

  private static final class Parser {
    private final Tokenizer scanner;
    private final TimeZoneComposer tz = new TimeZoneComposer();
    private final TimeComposer time = new TimeComposer();
    private final DayComposer day = new DayComposer();

    Parser(String str) {
      this.scanner = new Tokenizer(new InputReader(str));
    }

    boolean parse(double[] out) {
      DateToken nextUnhandledToken = parseEs5DateTime();
      if (nextUnhandledToken.isInvalid()) {
        return false;
      }
      boolean hasReadNumber = !day.isEmpty();
      for (DateToken token = nextUnhandledToken; !token.isEndOfInput(); token = scanner.next()) {
        if (token.isNumber()) {
          hasReadNumber = true;
          int n = token.value;
          if (scanner.skipSymbol(':')) {
            if (scanner.skipSymbol(':')) {
              if (!time.isEmpty()) {
                return false;
              }
              time.add(n);
              time.add(0);
            } else {
              if (!time.add(n)) {
                return false;
              }
              if (scanner.peek().isSymbol('.')) {
                scanner.next();
              }
            }
          } else if (scanner.skipSymbol('.') && time.isExpecting(n)) {
            time.add(n);
            if (!scanner.peek().isNumber()) {
              return false;
            }
            int ms = readMilliseconds(scanner.next());
            if (ms < 0) {
              return false;
            }
            time.addFinal(ms);
          } else if (tz.isExpecting(n)) {
            tz.minute = n;
          } else if (time.isExpecting(n)) {
            time.addFinal(n);
            DateToken peek = scanner.peek();
            if (!peek.isEndOfInput() && !peek.isWhiteSpace() && !peek.isKeywordZ() && !peek.isAsciiSign()) {
              return false;
            }
          } else {
            if (!day.add(n)) {
              return false;
            }
            scanner.skipSymbol('-');
          }
        } else if (token.isKeyword()) {
          int type = token.tag;
          int value = token.value;
          if (type == AM_PM && !time.isEmpty()) {
            time.hourOffset = value;
          } else if (type == MONTH_NAME) {
            day.namedMonth = value;
            scanner.skipSymbol('-');
          } else if (type == TIME_ZONE_NAME && hasReadNumber) {
            tz.set(value);
          } else {
            if (hasReadNumber) {
              return false;
            }
            if (scanner.peek().isNumber()) {
              return false;
            }
          }
        } else if (token.isAsciiSign() && (tz.isUtc() || !time.isEmpty())) {
          tz.setSign(token.asciiSign());
          int n = 0;
          int length = 0;
          if (scanner.peek().isNumber()) {
            DateToken nextToken = scanner.next();
            length = nextToken.length;
            n = nextToken.value;
          }
          hasReadNumber = true;
          if (scanner.peek().isSymbol(':')) {
            tz.hour = n;
            tz.minute = NONE;
          } else if (length == 2 || length == 1) {
            tz.hour = n;
            tz.minute = 0;
          } else if (length == 4 || length == 3) {
            tz.hour = n / 100;
            tz.minute = n % 100;
          } else {
            return false;
          }
        } else if ((token.isAsciiSign() || token.isSymbol(')')) && hasReadNumber) {
          return false;
        }
        // Ignore other characters and whitespace
      }
      return day.write(out) && time.write(out) && tz.write(out);
    }

    private DateToken parseEs5DateTime() {
      if (scanner.peek().isAsciiSign()) {
        DateToken signToken = scanner.next();
        if (!scanner.peek().isFixedLengthNumber(6)) {
          return signToken;
        }
        int sign = signToken.asciiSign();
        int year = scanner.next().value;
        if (sign < 0 && year == 0) {
          return signToken;
        }
        day.add(sign * year);
      } else if (scanner.peek().isFixedLengthNumber(4)) {
        day.add(scanner.next().value);
      } else {
        return scanner.next();
      }
      if (scanner.skipSymbol('-')) {
        if (!scanner.peek().isFixedLengthNumber(2) || !DayComposer.isMonth(scanner.peek().value)) {
          return scanner.next();
        }
        day.add(scanner.next().value);
        if (scanner.skipSymbol('-')) {
          if (!scanner.peek().isFixedLengthNumber(2) || !DayComposer.isDay(scanner.peek().value)) {
            return scanner.next();
          }
          day.add(scanner.next().value);
        }
      }
      if (!scanner.peek().isKeywordType(TIME_SEPARATOR)) {
        if (!scanner.peek().isEndOfInput()) {
          return scanner.next();
        }
      } else {
        scanner.next();
        if (!scanner.peek().isFixedLengthNumber(2) || !between(scanner.peek().value, 0, 24)) {
          return DateToken.INVALID_TOKEN;
        }
        boolean hourIs24 = scanner.peek().value == 24;
        time.add(scanner.next().value);
        if (!scanner.skipSymbol(':')) {
          return DateToken.INVALID_TOKEN;
        }
        if (!scanner.peek().isFixedLengthNumber(2) || !TimeComposer.isMinute(scanner.peek().value)
          || (hourIs24 && scanner.peek().value > 0)) {
          return DateToken.INVALID_TOKEN;
        }
        time.add(scanner.next().value);
        if (scanner.skipSymbol(':')) {
          if (!scanner.peek().isFixedLengthNumber(2) || !TimeComposer.isSecond(scanner.peek().value)
            || (hourIs24 && scanner.peek().value > 0)) {
            return DateToken.INVALID_TOKEN;
          }
          time.add(scanner.next().value);
          if (scanner.skipSymbol('.')) {
            if (!scanner.peek().isNumber() || (hourIs24 && scanner.peek().value > 0)) {
              return DateToken.INVALID_TOKEN;
            }
            time.add(readMilliseconds(scanner.next()));
          }
        }
        if (scanner.peek().isKeywordZ()) {
          scanner.next();
          tz.set(0);
        } else if (scanner.peek().isSymbol('+') || scanner.peek().isSymbol('-')) {
          tz.setSign(scanner.next().value == '+' ? 1 : -1);
          if (scanner.peek().isFixedLengthNumber(4)) {
            int hourmin = scanner.next().value;
            int hour = hourmin / 100;
            int min = hourmin % 100;
            if (!TimeComposer.isHour(hour) || !TimeComposer.isMinute(min)) {
              return DateToken.INVALID_TOKEN;
            }
            tz.hour = hour;
            tz.minute = min;
          } else {
            if (!scanner.peek().isFixedLengthNumber(2) || !TimeComposer.isHour(scanner.peek().value)) {
              return DateToken.INVALID_TOKEN;
            }
            tz.hour = scanner.next().value;
            if (!scanner.skipSymbol(':')) {
              return DateToken.INVALID_TOKEN;
            }
            if (!scanner.peek().isFixedLengthNumber(2) || !TimeComposer.isMinute(scanner.peek().value)) {
              return DateToken.INVALID_TOKEN;
            }
            tz.minute = scanner.next().value;
          }
        }
        if (!scanner.peek().isEndOfInput()) {
          return DateToken.INVALID_TOKEN;
        }
      }
      if (tz.isEmpty() && time.isEmpty()) {
        tz.set(0);
      }
      day.isIsoDate = true;
      return DateToken.END;
    }
  }
}
