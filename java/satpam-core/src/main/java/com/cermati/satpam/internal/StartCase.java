package com.cermati.satpam.internal;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * lodash 4 {@code startCase}, used to turn a property name into a display name in messages
 * ({@code secondaryEmail} becomes {@code Secondary Email}).
 *
 * <p>Ported from lodash's {@code deburr}, {@code words} ({@code reAsciiWord} / {@code reUnicodeWord})
 * and {@code upperFirst}. The emoji alternative of {@code reUnicodeWord} is left out; it only
 * matters for property names containing emoji.
 */
public final class StartCase {
  private static final String COMBO_RANGE = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff";
  private static final String ASTRAL_RANGE = "\\ud800-\\udfff";
  private static final String DINGBAT_RANGE = "\\u2700-\\u27bf";
  private static final String LOWER_RANGE = "a-z\\xdf-\\xf6\\xf8-\\xff";
  private static final String MATH_OP_RANGE = "\\xac\\xb1\\xd7\\xf7";
  private static final String NON_CHAR_RANGE = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf";
  private static final String PUNCTUATION_RANGE = "\\u2000-\\u206f";
  private static final String SPACE_RANGE = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001"
    + "\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
  private static final String UPPER_RANGE = "A-Z\\xc0-\\xd6\\xd8-\\xde";
  private static final String BREAK_RANGE = MATH_OP_RANGE + NON_CHAR_RANGE + PUNCTUATION_RANGE + SPACE_RANGE;

  private static final String RS_APOS = "['\\u2019]";
  private static final String RS_BREAK = "[" + BREAK_RANGE + "]";
  private static final String RS_DIGITS = "\\d+";
  private static final String RS_LOWER = "[" + LOWER_RANGE + "]";
  private static final String RS_MISC =
    "[^" + ASTRAL_RANGE + BREAK_RANGE + RS_DIGITS + DINGBAT_RANGE + LOWER_RANGE + UPPER_RANGE + "]";
  private static final String RS_UPPER = "[" + UPPER_RANGE + "]";
  private static final String RS_MISC_LOWER = "(?:" + RS_LOWER + "|" + RS_MISC + ")";
  private static final String RS_MISC_UPPER = "(?:" + RS_UPPER + "|" + RS_MISC + ")";
  private static final String RS_OPT_CONTR_LOWER = "(?:" + RS_APOS + "(?:d|ll|m|re|s|t|ve))?";
  private static final String RS_OPT_CONTR_UPPER = "(?:" + RS_APOS + "(?:D|LL|M|RE|S|T|VE))?";
  private static final String RS_ORD_LOWER = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])";
  private static final String RS_ORD_UPPER = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])";

  private static final Pattern RE_UNICODE_WORD = Pattern.compile(String.join("|",
    RS_UPPER + "?" + RS_LOWER + "+" + RS_OPT_CONTR_LOWER + "(?=" + RS_BREAK + "|" + RS_UPPER + "|\\z)",
    RS_MISC_UPPER + "+" + RS_OPT_CONTR_UPPER + "(?=" + RS_BREAK + "|" + RS_UPPER + RS_MISC_LOWER + "|\\z)",
    RS_UPPER + "?" + RS_MISC_LOWER + "+" + RS_OPT_CONTR_LOWER,
    RS_UPPER + "+" + RS_OPT_CONTR_UPPER,
    RS_ORD_UPPER,
    RS_ORD_LOWER,
    RS_DIGITS
  ));
  private static final Pattern RE_ASCII_WORD = Pattern.compile("[^\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\x7f]+");
  private static final Pattern RE_HAS_UNICODE_WORD =
    Pattern.compile("[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]");
  private static final Pattern RE_APOS = Pattern.compile(RS_APOS);
  private static final Pattern RE_COMBO_MARK = Pattern.compile("[" + COMBO_RANGE + "]");

  /** lodash deburredLetters for U+00C0..U+017F, {@code null} where the letter is kept as-is. */
  private static final String[] DEBURRED = {
    "A", "A", "A", "A", "A", "A", "Ae", "C", "E", "E", "E", "E", "I", "I", "I", "I",
    "D", "N", "O", "O", "O", "O", "O", null, "O", "U", "U", "U", "U", "Y", "Th", "ss",
    "a", "a", "a", "a", "a", "a", "ae", "c", "e", "e", "e", "e", "i", "i", "i", "i",
    "d", "n", "o", "o", "o", "o", "o", null, "o", "u", "u", "u", "u", "y", "th", "y",
    "A", "a", "A", "a", "A", "a", "C", "c", "C", "c", "C", "c", "C", "c", "D", "d",
    "D", "d", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "G", "g", "G", "g",
    "G", "g", "G", "g", "H", "h", "H", "h", "I", "i", "I", "i", "I", "i", "I", "i",
    "I", "i", "IJ", "ij", "J", "j", "K", "k", "k", "L", "l", "L", "l", "L", "l", "L",
    "l", "L", "l", "N", "n", "N", "n", "N", "n", "'n", "N", "n", "O", "o", "O", "o",
    "O", "o", "Oe", "oe", "R", "r", "R", "r", "R", "r", "S", "s", "S", "s", "S", "s",
    "S", "s", "T", "t", "T", "t", "T", "t", "U", "u", "U", "u", "U", "u", "U", "u",
    "U", "u", "U", "u", "W", "w", "Y", "y", "Y", "Z", "z", "Z", "z", "Z", "z", "s",
  };

  private StartCase() {
  }

  public static String startCase(String value) {
    String prepared = RE_APOS.matcher(deburr(value)).replaceAll("");
    StringBuilder result = new StringBuilder();
    List<String> words = words(prepared);
    for (int i = 0; i < words.size(); i++) {
      if (i > 0) {
        result.append(' ');
      }
      result.append(upperFirst(words.get(i)));
    }
    return result.toString();
  }

  static List<String> words(String value) {
    Pattern pattern = RE_HAS_UNICODE_WORD.matcher(value).find() ? RE_UNICODE_WORD : RE_ASCII_WORD;
    List<String> result = new ArrayList<>();
    Matcher matcher = pattern.matcher(value);
    while (matcher.find()) {
      result.add(matcher.group());
    }
    return result;
  }

  static String deburr(String value) {
    StringBuilder sb = new StringBuilder(value.length());
    for (int i = 0; i < value.length(); i++) {
      char c = value.charAt(i);
      String mapped = c >= 0xc0 && c <= 0x17f ? DEBURRED[c - 0xc0] : null;
      sb.append(mapped != null ? mapped : String.valueOf(c));
    }
    return RE_COMBO_MARK.matcher(sb).replaceAll("");
  }

  private static String upperFirst(String word) {
    if (word.isEmpty()) {
      return word;
    }
    int first = word.offsetByCodePoints(0, 1);
    return word.substring(0, first).toUpperCase(java.util.Locale.ROOT) + word.substring(first);
  }
}
