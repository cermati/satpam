package com.cermati.satpam.internal;

import com.cermati.satpam.Undefined;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * JavaScript value semantics over normalized values (see {@link Normalizer}): {@code null},
 * {@link Undefined}, {@link String}, {@link Double}, {@link Boolean}, {@code Map<String, Object>}
 * (JS object) and {@code List<Object>} (JS array). Anything else is treated as an opaque JS object.
 */
public final class JsValues {
  /** JS {@code String.prototype.trim} / lodash {@code trim} whitespace + line terminators. */
  static final String WHITESPACE_CHARS =
    "\t\n\u000b\f\r              "
      + "    　﻿";

  private static final Pattern DECIMAL_LITERAL =
    Pattern.compile("[+-]?(?:(?:[0-9]+(?:\\.[0-9]*)?)|(?:\\.[0-9]+))(?:[eE][+-]?[0-9]+)?");
  private static final Pattern HEX_LITERAL = Pattern.compile("0[xX][0-9a-fA-F]+");
  private static final Pattern OCTAL_LITERAL = Pattern.compile("0[oO][0-7]+");
  private static final Pattern BINARY_LITERAL = Pattern.compile("0[bB][01]+");

  private JsValues() {
  }

  public static boolean isUndefined(Object value) {
    return value instanceof Undefined;
  }

  /** ramda/lodash {@code isNil}: {@code null} or {@code undefined}. */
  public static boolean isNil(Object value) {
    return value == null || value instanceof Undefined;
  }

  public static boolean isString(Object value) {
    return value instanceof String;
  }

  public static boolean isArray(Object value) {
    return value instanceof List;
  }

  public static boolean isPlainObject(Object value) {
    return value instanceof Map;
  }

  @SuppressWarnings("unchecked")
  public static List<Object> asList(Object value) {
    return (List<Object>) value;
  }

  @SuppressWarnings("unchecked")
  public static Map<String, Object> asMap(Object value) {
    return (Map<String, Object>) value;
  }

  /** JS truthiness: {@code false, 0, -0, NaN, "", null, undefined} are falsy. */
  public static boolean truthy(Object value) {
    if (isNil(value)) {
      return false;
    }
    if (value instanceof Boolean) {
      return (Boolean) value;
    }
    if (value instanceof Double) {
      double d = (Double) value;
      return d != 0 && !Double.isNaN(d);
    }
    if (value instanceof String) {
      return !((String) value).isEmpty();
    }
    return true;
  }

  /** JS {@code Number(value)} (ToNumber). */
  public static double toNumber(Object value) {
    if (value == null) {
      return 0;
    }
    if (value instanceof Undefined) {
      return Double.NaN;
    }
    if (value instanceof Double) {
      return (Double) value;
    }
    if (value instanceof Number) {
      return ((Number) value).doubleValue();
    }
    if (value instanceof Boolean) {
      return ((Boolean) value) ? 1 : 0;
    }
    if (value instanceof String) {
      return stringToNumber((String) value);
    }
    // Objects and arrays go through ToPrimitive, which for plain values is their toString()
    return stringToNumber(toJsString(value));
  }

  private static double stringToNumber(String raw) {
    String s = trim(raw);
    if (s.isEmpty()) {
      return 0;
    }
    switch (s) {
      case "Infinity":
      case "+Infinity":
        return Double.POSITIVE_INFINITY;
      case "-Infinity":
        return Double.NEGATIVE_INFINITY;
      default:
        break;
    }
    if (DECIMAL_LITERAL.matcher(s).matches()) {
      return Double.parseDouble(s);
    }
    if (HEX_LITERAL.matcher(s).matches()) {
      return new BigInteger(s.substring(2), 16).doubleValue();
    }
    if (OCTAL_LITERAL.matcher(s).matches()) {
      return new BigInteger(s.substring(2), 8).doubleValue();
    }
    if (BINARY_LITERAL.matcher(s).matches()) {
      return new BigInteger(s.substring(2), 2).doubleValue();
    }
    return Double.NaN;
  }

  /** JS {@code String(value)}. */
  public static String toJsString(Object value) {
    if (value == null) {
      return "null";
    }
    if (value instanceof Undefined) {
      return "undefined";
    }
    if (value instanceof String) {
      return (String) value;
    }
    if (value instanceof Double) {
      return numberToString((Double) value);
    }
    if (value instanceof Number) {
      return numberToString(((Number) value).doubleValue());
    }
    if (value instanceof Boolean) {
      return value.toString();
    }
    if (value instanceof List) {
      // Array.prototype.join(','): null and undefined elements become ''
      StringBuilder sb = new StringBuilder();
      List<Object> list = asList(value);
      for (int i = 0; i < list.size(); i++) {
        if (i > 0) {
          sb.append(',');
        }
        Object item = list.get(i);
        if (!isNil(item)) {
          sb.append(toJsString(item));
        }
      }
      return sb.toString();
    }
    if (value instanceof Map) {
      return "[object Object]";
    }
    return value.toString();
  }

  /** JS {@code Number.prototype.toString()} for a double. */
  public static String numberToString(double d) {
    if (Double.isNaN(d)) {
      return "NaN";
    }
    if (Double.isInfinite(d)) {
      return d > 0 ? "Infinity" : "-Infinity";
    }
    if (d == 0) {
      return "0";
    }
    BigDecimal bd = shortestDecimal(Math.abs(d));
    String digits = bd.unscaledValue().toString();
    int k = digits.length();
    int n = k - bd.scale(); // decimal point position, as in ECMAScript Number::toString
    StringBuilder sb = new StringBuilder();
    if (d < 0) {
      sb.append('-');
    }
    if (k <= n && n <= 21) {
      sb.append(digits);
      for (int i = 0; i < n - k; i++) {
        sb.append('0');
      }
    } else if (0 < n && n <= 21) {
      sb.append(digits, 0, n).append('.').append(digits, n, k);
    } else if (-6 < n && n <= 0) {
      sb.append("0.");
      for (int i = 0; i < -n; i++) {
        sb.append('0');
      }
      sb.append(digits);
    } else {
      int e = n - 1;
      sb.append(digits.charAt(0));
      if (k > 1) {
        sb.append('.').append(digits, 1, k);
      }
      sb.append('e').append(e < 0 ? '-' : '+').append(Math.abs(e));
    }
    return sb.toString();
  }

  /**
   * Shortest decimal that round-trips to {@code d}, as ECMAScript Number::toString requires.
   * {@link Double#toString} is not always shortest before JDK 19 (JDK-4511638), e.g. 4.9E-324.
   */
  private static BigDecimal shortestDecimal(double d) {
    if (d == Math.rint(d) && d < 9007199254740992d) {
      return new BigDecimal((long) d).stripTrailingZeros();
    }
    BigDecimal exact = new BigDecimal(d);
    for (int precision = 1; precision < 17; precision++) {
      BigDecimal candidate = exact.round(new MathContext(precision, RoundingMode.HALF_EVEN));
      if (candidate.doubleValue() == d) {
        return candidate.stripTrailingZeros();
      }
    }
    return exact.round(new MathContext(17, RoundingMode.HALF_EVEN)).stripTrailingZeros();
  }

  /** JS {@code ===}. Objects and arrays compare by identity. */
  public static boolean strictEquals(Object a, Object b) {
    if (a instanceof Double && b instanceof Double) {
      return ((Double) a).doubleValue() == ((Double) b).doubleValue();
    }
    if (a == null || b == null) {
      return a == b;
    }
    if (a instanceof String || a instanceof Boolean || a instanceof Undefined) {
      return a.equals(b);
    }
    return a == b;
  }

  /** SameValueZero, used by {@code Array.prototype.includes} and lodash {@code includes}. */
  public static boolean sameValueZero(Object a, Object b) {
    if (a instanceof Double && b instanceof Double && ((Double) a).isNaN() && ((Double) b).isNaN()) {
      return true;
    }
    return strictEquals(a, b);
  }

  /** ramda {@code R.equals}: deep structural equality, SameValue for numbers. */
  public static boolean ramdaEquals(Object a, Object b) {
    if (a instanceof Double && b instanceof Double) {
      // SameValue: NaN equals NaN, 0 does not equal -0
      return ((Double) a).equals(b);
    }
    if (a instanceof List && b instanceof List) {
      List<Object> la = asList(a);
      List<Object> lb = asList(b);
      if (la.size() != lb.size()) {
        return false;
      }
      for (int i = 0; i < la.size(); i++) {
        if (!ramdaEquals(la.get(i), lb.get(i))) {
          return false;
        }
      }
      return true;
    }
    if (a instanceof Map && b instanceof Map) {
      Map<String, Object> ma = asMap(a);
      Map<String, Object> mb = asMap(b);
      if (ma.size() != mb.size()) {
        return false;
      }
      for (Map.Entry<String, Object> entry : ma.entrySet()) {
        if (!mb.containsKey(entry.getKey()) || !ramdaEquals(entry.getValue(), mb.get(entry.getKey()))) {
          return false;
        }
      }
      return true;
    }
    return Objects.equals(a, b);
  }

  /** ramda {@code R.isEmpty}: {@code ""}, {@code []} and {@code {}}. */
  public static boolean ramdaIsEmpty(Object value) {
    if (value instanceof String) {
      return ((String) value).isEmpty();
    }
    if (value instanceof List) {
      return ((List<?>) value).isEmpty();
    }
    if (value instanceof Map) {
      return ((Map<?, ?>) value).isEmpty();
    }
    return false;
  }

  /** JS / lodash {@code trim}. */
  public static String trim(String s) {
    int start = 0;
    int end = s.length();
    while (start < end && WHITESPACE_CHARS.indexOf(s.charAt(start)) >= 0) {
      start++;
    }
    while (end > start && WHITESPACE_CHARS.indexOf(s.charAt(end - 1)) >= 0) {
      end--;
    }
    return s.substring(start, end);
  }

  /**
   * JS {@code obj[key]}. Throws like JS does when {@code obj} is {@code null}/{@code undefined}.
   */
  public static Object getProperty(Object obj, Object key) {
    if (isNil(obj)) {
      throw new IllegalArgumentException(
        "TypeError: Cannot read properties of " + toJsString(obj) + " (reading '" + toJsString(key) + "')");
    }
    return getPropertyOrUndefined(obj, toJsString(key));
  }

  private static Object getPropertyOrUndefined(Object obj, String key) {
    if (obj instanceof Map) {
      Map<String, Object> map = asMap(obj);
      return map.containsKey(key) ? map.get(key) : Undefined.INSTANCE;
    }
    if (obj instanceof List) {
      List<Object> list = asList(obj);
      if ("length".equals(key)) {
        return (double) list.size();
      }
      Integer index = arrayIndex(key);
      return index != null && index < list.size() ? list.get(index) : Undefined.INSTANCE;
    }
    if (obj instanceof String) {
      String s = (String) obj;
      if ("length".equals(key)) {
        return (double) s.length();
      }
      Integer index = arrayIndex(key);
      return index != null && index < s.length() ? String.valueOf(s.charAt(index)) : Undefined.INSTANCE;
    }
    return Undefined.INSTANCE;
  }

  private static Integer arrayIndex(String key) {
    if (key.isEmpty() || key.length() > 9) {
      return null;
    }
    for (int i = 0; i < key.length(); i++) {
      if (key.charAt(i) < '0' || key.charAt(i) > '9') {
        return null;
      }
    }
    if (key.length() > 1 && key.charAt(0) == '0') {
      return null;
    }
    return Integer.parseInt(key);
  }

  /** lodash {@code get(obj, path)}: supports {@code a.b[0].c} paths, never throws. */
  public static Object lodashGet(Object obj, String path) {
    if (isNil(obj)) {
      return Undefined.INSTANCE;
    }
    // A key that exists as-is wins over path parsing (lodash isKey)
    if (obj instanceof Map && asMap(obj).containsKey(path)) {
      return asMap(obj).get(path);
    }
    if (path.indexOf('.') < 0 && path.indexOf('[') < 0) {
      return getPropertyOrUndefined(obj, path);
    }
    Object current = obj;
    for (String segment : stringToPath(path)) {
      if (isNil(current)) {
        return Undefined.INSTANCE;
      }
      current = getPropertyOrUndefined(current, segment);
    }
    return current;
  }

  /** lodash {@code stringToPath}: {@code a[0].b["c"]} -> {@code [a, 0, b, c]}. */
  static List<String> stringToPath(String path) {
    List<String> result = new ArrayList<>();
    int i = 0;
    int n = path.length();
    if (n > 0 && path.charAt(0) == '.') {
      result.add("");
    }
    StringBuilder current = new StringBuilder();
    while (i < n) {
      char c = path.charAt(i);
      if (c == '.') {
        if (current.length() > 0 || (i > 0 && path.charAt(i - 1) == '.')) {
          result.add(current.toString());
        }
        current.setLength(0);
        i++;
      } else if (c == '[') {
        if (current.length() > 0) {
          result.add(current.toString());
          current.setLength(0);
        }
        int close = path.indexOf(']', i);
        if (close < 0) {
          current.append(path.substring(i));
          break;
        }
        String inner = path.substring(i + 1, close);
        if (inner.length() >= 2 && (inner.charAt(0) == '"' || inner.charAt(0) == '\'')
          && inner.charAt(inner.length() - 1) == inner.charAt(0)) {
          inner = inner.substring(1, inner.length() - 1).replace("\\", "");
        }
        result.add(inner);
        i = close + 1;
      } else {
        current.append(c);
        i++;
      }
    }
    if (current.length() > 0) {
      result.add(current.toString());
    }
    return result;
  }

  /**
   * Items to iterate for rules that loop over a "list" param: a JS array, or the characters of a
   * string (ramda {@code any/all} and {@code for...of} iterate strings by character). Other values
   * iterate nothing.
   */
  public static List<Object> iterate(Object listLike) {
    if (listLike instanceof List) {
      return asList(listLike);
    }
    if (listLike instanceof String) {
      String s = (String) listLike;
      List<Object> chars = new ArrayList<>(s.length());
      for (int i = 0; i < s.length(); i++) {
        chars.add(String.valueOf(s.charAt(i)));
      }
      return chars;
    }
    return Collections.emptyList();
  }

  /**
   * JS {@code list.indexOf(item) !== -1}: strict equality for arrays, substring search (with the
   * item converted to string) when {@code list} is a string.
   */
  public static boolean indexOfContains(Object list, Object item) {
    if (list instanceof String) {
      return ((String) list).contains(toJsString(item));
    }
    if (list instanceof List) {
      for (Object element : asList(list)) {
        if (strictEquals(element, item)) {
          return true;
        }
      }
      return false;
    }
    throw new IllegalArgumentException("TypeError: list.indexOf is not a function");
  }

  /** lodash {@code includes(collection, value)}: SameValueZero for arrays, substring for strings. */
  public static boolean lodashIncludes(Object collection, Object value) {
    if (collection instanceof String) {
      return ((String) collection).contains(toJsString(value));
    }
    if (collection instanceof List) {
      for (Object element : asList(collection)) {
        if (sameValueZero(element, value)) {
          return true;
        }
      }
      return false;
    }
    if (collection instanceof Map) {
      for (Object element : asMap(collection).values()) {
        if (sameValueZero(element, value)) {
          return true;
        }
      }
    }
    return false;
  }

  /** Values as an array: the list itself, or a one-element list (JS {@code is(Array, v) ? v : [v]}). */
  public static List<Object> asArray(Object value) {
    return value instanceof List ? asList(value) : Collections.singletonList(value);
  }
  /** JS {@code /\s/.test(s)}: whether {@code s} contains a JS whitespace or line terminator. */
  public static boolean hasWhitespace(String s) {
    for (int i = 0; i < s.length(); i++) {
      if (WHITESPACE_CHARS.indexOf(s.charAt(i)) >= 0) {
        return true;
      }
    }
    return false;
  }

  /** JS {@code s.split(separator)} with a string separator: keeps empty parts, {@code ""} splits into code units. */
  public static List<String> split(String s, String separator) {
    List<String> parts = new ArrayList<>();
    if (separator.isEmpty()) {
      for (int i = 0; i < s.length(); i++) {
        parts.add(String.valueOf(s.charAt(i)));
      }
      return parts;
    }
    int start = 0;
    int index;
    while ((index = s.indexOf(separator, start)) >= 0) {
      parts.add(s.substring(start, index));
      start = index + separator.length();
    }
    parts.add(s.substring(start));
    return parts;
  }

  /**
   * {@code value.method(...)} where only strings have {@code method}: returns the string, or throws
   * the TypeError JS would throw for any other value.
   */
  public static String requireString(Object value, String method) {
    if (value instanceof String) {
      return (String) value;
    }
    if (isNil(value)) {
      throw new IllegalArgumentException(
        "TypeError: Cannot read properties of " + toJsString(value) + " (reading '" + method + "')");
    }
    throw new IllegalArgumentException("TypeError: value." + method + " is not a function");
  }

  /** JS {@code s.substr(start, length)} for a non-negative start. */
  public static String substr(String s, int start, int length) {
    int from = Math.min(start, s.length());
    return s.substring(from, Math.min(from + length, s.length()));
  }

  /**
   * lodash {@code toString}: {@code ""} for {@code null}/{@code undefined}, {@code "-0"} for -0, and
   * arrays are joined recursively with nested {@code null} as {@code "null"}.
   */
  public static String lodashToString(Object value) {
    return isNil(value) ? "" : lodashBaseToString(value);
  }

  private static String lodashBaseToString(Object value) {
    if (value instanceof List) {
      StringBuilder sb = new StringBuilder();
      List<Object> list = asList(value);
      for (int i = 0; i < list.size(); i++) {
        if (i > 0) {
          sb.append(',');
        }
        Object item = list.get(i);
        // arrayMap(value, baseToString) + '': mapped null/undefined are strings, nested arrays join
        sb.append(item instanceof List ? lodashBaseToString(item) : toJsString(item instanceof Double ? lodashNumber((Double) item) : item));
      }
      return sb.toString();
    }
    if (value instanceof Double) {
      return lodashNumber((Double) value);
    }
    return toJsString(value);
  }

  private static String lodashNumber(double d) {
    return d == 0 && 1 / d < 0 ? "-0" : numberToString(d);
  }
}
