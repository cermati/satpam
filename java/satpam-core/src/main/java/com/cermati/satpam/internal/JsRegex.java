package com.cermati.satpam.internal;

import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * A JavaScript regular expression compiled to {@link Pattern}, with {@link #test(String)} behaving
 * like {@code RegExp.prototype.test} on a fresh RegExp.
 *
 * <p>The source is translated where JS and Java differ:
 * <ul>
 *   <li>{@code $} without the {@code m} flag only matches at the very end (Java's also matches
 *   before a final line terminator)</li>
 *   <li>{@code .} without the {@code s} flag excludes exactly {@code \n \r    }</li>
 *   <li>{@code \s} / {@code \S} use the JS whitespace set (includes Unicode spaces)</li>
 *   <li>{@code [^]} (anything) and {@code []} (nothing)</li>
 *   <li>{@code [} and {@code &} inside a class are literals in JS (nested class / intersection in Java)</li>
 *   <li>a <code>&#123;</code> that does not start a quantifier is a literal in JS</li>
 *   <li>{@code \v}, {@code \0}, {@code [\b]}, {@code &#92;u{...}} and identity escapes such as {@code \a}</li>
 * </ul>
 */
public final class JsRegex {
  private static final String WS_CLASS_BODY = "\\t\\n\\x0B\\f\\r \\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff";
  private static final String JS_ESCAPE_LETTERS = "dDwWsSbBnrtfvcxukpP";

  private final Pattern pattern;
  private final boolean sticky;

  private JsRegex(Pattern pattern, boolean sticky) {
    this.pattern = pattern;
    this.sticky = sticky;
  }

  /**
   * @throws IllegalArgumentException when JS would throw a SyntaxError (invalid pattern or flags)
   */
  public static JsRegex compile(String source, String flags) {
    String safeFlags = flags == null ? "" : flags;
    boolean ignoreCase = false;
    boolean multiline = false;
    boolean dotAll = false;
    boolean unicode = false;
    boolean sticky = false;
    for (int i = 0; i < safeFlags.length(); i++) {
      char flag = safeFlags.charAt(i);
      if (safeFlags.indexOf(flag) != i) {
        throw new IllegalArgumentException("SyntaxError: Invalid flags supplied to RegExp constructor '" + safeFlags + "'");
      }
      switch (flag) {
        case 'i':
          ignoreCase = true;
          break;
        case 'm':
          multiline = true;
          break;
        case 's':
          dotAll = true;
          break;
        case 'u':
        case 'v':
          unicode = true;
          break;
        case 'y':
          sticky = true;
          break;
        case 'g':
        case 'd':
          // No effect on a single test() of a fresh RegExp
          break;
        default:
          throw new IllegalArgumentException("SyntaxError: Invalid flags supplied to RegExp constructor '" + safeFlags + "'");
      }
    }

    int javaFlags = 0;
    if (ignoreCase) {
      javaFlags |= Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE;
    }
    if (multiline) {
      javaFlags |= Pattern.MULTILINE;
    }
    if (dotAll) {
      javaFlags |= Pattern.DOTALL;
    }

    String translated = translate(source, multiline, dotAll, unicode);
    try {
      return new JsRegex(Pattern.compile(translated, javaFlags), sticky);
    } catch (PatternSyntaxException e) {
      throw new IllegalArgumentException("SyntaxError: Invalid regular expression: /" + source + "/: " + e.getDescription(), e);
    }
  }

  public static JsRegex compile(String source) {
    return compile(source, "");
  }

  public boolean test(String input) {
    return sticky ? pattern.matcher(input).lookingAt() : pattern.matcher(input).find();
  }

  public Pattern pattern() {
    return pattern;
  }

  static String translate(String src, boolean multiline, boolean dotAll, boolean unicode) {
    StringBuilder out = new StringBuilder(src.length() + 16);
    boolean inClass = false;
    int n = src.length();
    int i = 0;
    while (i < n) {
      char c = src.charAt(i);
      if (c == '\\') {
        if (i + 1 >= n) {
          throw new IllegalArgumentException("SyntaxError: Invalid regular expression: /" + src + "/: \\ at end of pattern");
        }
        char d = src.charAt(i + 1);
        i += 2;
        if (d == 's') {
          out.append(inClass ? WS_CLASS_BODY : "[" + WS_CLASS_BODY + "]");
        } else if (d == 'S') {
          out.append(inClass ? "\\S" : "[^" + WS_CLASS_BODY + "]");
        } else if (d == 'v') {
          out.append("\\x0B");
        } else if (d == 'b' && inClass) {
          out.append("\\x08");
        } else if (d == '0' && (i >= n || !Character.isDigit(src.charAt(i)))) {
          out.append("\\x00");
        } else if (d == 'u' && unicode && i < n && src.charAt(i) == '{') {
          int close = src.indexOf('}', i);
          if (close < 0) {
            throw new IllegalArgumentException("SyntaxError: Invalid regular expression: /" + src + "/: Invalid Unicode escape");
          }
          out.append("\\x{").append(src, i + 1, close).append('}');
          i = close + 1;
        } else if (((d == 'p' || d == 'P') && !unicode) || (d == 'k' && !src.contains("(?<"))) {
          // Without the u flag these are identity escapes
          out.append(d);
        } else if (Character.isLetter(d) && JS_ESCAPE_LETTERS.indexOf(d) < 0) {
          // Identity escape of a letter, e.g. \a is just "a" in JS (but bell in Java)
          out.append(d);
        } else {
          out.append('\\').append(d);
        }
        continue;
      }

      if (inClass) {
        if (c == ']') {
          inClass = false;
          out.append(']');
        } else if (c == '[' || c == '&') {
          out.append('\\').append(c);
        } else {
          out.append(c);
        }
        i++;
        continue;
      }

      switch (c) {
        case '[':
          if (src.startsWith("[^]", i)) {
            out.append("[\\s\\S]");
            i += 3;
          } else if (src.startsWith("[]", i)) {
            out.append("(?!)");
            i += 2;
          } else {
            inClass = true;
            out.append('[');
            i++;
            if (i < n && src.charAt(i) == '^') {
              out.append('^');
              i++;
            }
          }
          break;
        case '$':
          out.append(multiline ? "$" : "\\z");
          i++;
          break;
        case '.':
          out.append(dotAll ? "." : "[^\\n\\r\\u2028\\u2029]");
          i++;
          break;
        case '{': {
          int end = quantifierEnd(src, i);
          if (end < 0) {
            out.append("\\{");
            i++;
          } else {
            out.append(src, i, end);
            i = end;
          }
          break;
        }
        case '}':
          out.append("\\}");
          i++;
          break;
        default:
          out.append(c);
          i++;
          break;
      }
    }
    return out.toString();
  }

  /** End index (exclusive) of a {@code {n}}, {@code {n,}} or {@code {n,m}} quantifier at {@code start}, or -1. */
  private static int quantifierEnd(String src, int start) {
    int i = start + 1;
    int n = src.length();
    int digitsStart = i;
    while (i < n && Character.isDigit(src.charAt(i))) {
      i++;
    }
    if (i == digitsStart) {
      return -1;
    }
    if (i < n && src.charAt(i) == ',') {
      i++;
      while (i < n && Character.isDigit(src.charAt(i))) {
        i++;
      }
    }
    return i < n && src.charAt(i) == '}' ? i + 1 : -1;
  }
}
