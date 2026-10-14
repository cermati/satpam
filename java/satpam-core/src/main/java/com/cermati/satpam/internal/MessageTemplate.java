package com.cermati.satpam.internal;

import com.cermati.satpam.SatpamException;
import com.cermati.satpam.Undefined;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Renders satpam message templates the way lodash {@code _.template} does with default settings:
 * {@code <%= expr %>} (interpolate), {@code <%- expr %>} (HTML-escaped interpolate),
 * {@code ${expr}} (ES template interpolate) and {@code <% code %>} (evaluate, renders nothing).
 *
 * <p>Instead of running JavaScript, expressions are evaluated by a small interpreter that covers
 * what satpam messages use: identifiers from the data ({@code propertyName}, {@code ruleParams},
 * ...), number/string literals, {@code a[b]}, {@code a.b}, {@code Math.abs/floor/ceil/round(x)} and
 * {@code list.join(sep)}. Anything else throws {@link SatpamException}.
 */
public final class MessageTemplate {
  // Same alternation order as lodash's reDelimiters
  private static final Pattern DELIMITERS = Pattern.compile(
    "<%-([\\s\\S]+?)%>|<%=([\\s\\S]+?)%>|\\$\\{([^\\\\}]*(?:\\\\.[^\\\\}]*)*)\\}|<%([\\s\\S]+?)%>");

  private MessageTemplate() {
  }

  public static String render(String template, Map<String, Object> data) {
    if (template == null) {
      return "";
    }
    StringBuilder out = new StringBuilder();
    Matcher matcher = DELIMITERS.matcher(template);
    int last = 0;
    while (matcher.find()) {
      out.append(template, last, matcher.start());
      last = matcher.end();
      if (matcher.group(1) != null) {
        out.append(escape(interpolate(matcher.group(1), data)));
      } else if (matcher.group(2) != null) {
        out.append(interpolate(matcher.group(2), data));
      } else if (matcher.group(3) != null) {
        out.append(interpolate(matcher.group(3), data));
      }
      // group(4): evaluate block, produces no output
    }
    out.append(template, last, template.length());
    return out.toString();
  }

  private static String interpolate(String expression, Map<String, Object> data) {
    Object value = new Parser(expression, data).parseAll();
    // lodash: ((__t = (expr)) == null ? '' : __t)
    return JsValues.isNil(value) ? "" : JsValues.toJsString(value);
  }

  private static String escape(String s) {
    StringBuilder sb = new StringBuilder(s.length());
    for (int i = 0; i < s.length(); i++) {
      char c = s.charAt(i);
      switch (c) {
        case '&':
          sb.append("&amp;");
          break;
        case '<':
          sb.append("&lt;");
          break;
        case '>':
          sb.append("&gt;");
          break;
        case '"':
          sb.append("&quot;");
          break;
        case '\'':
          sb.append("&#39;");
          break;
        default:
          sb.append(c);
      }
    }
    return sb.toString();
  }

  private static final Object MATH = new Object();

  private static final class MethodRef {
    final Object target;
    final String name;

    MethodRef(Object target, String name) {
      this.target = target;
      this.name = name;
    }
  }

  private static final class Parser {
    private final String src;
    private final Map<String, Object> data;
    private int pos;

    Parser(String src, Map<String, Object> data) {
      this.src = src;
      this.data = data;
    }

    Object parseAll() {
      Object value = parseExpression();
      skipSpaces();
      if (pos != src.length()) {
        throw unsupported();
      }
      return value;
    }

    private Object parseExpression() {
      skipSpaces();
      Object value = parsePrimary();
      while (true) {
        skipSpaces();
        if (peek('[')) {
          pos++;
          Object key = parseExpression();
          expect(']');
          value = JsValues.getProperty(value, key);
        } else if (peek('.')) {
          pos++;
          skipSpaces();
          String name = parseIdentifier();
          value = member(value, name);
        } else if (peek('(')) {
          pos++;
          List<Object> args = parseArguments();
          value = call(value, args);
        } else {
          return value;
        }
      }
    }

    private Object member(Object target, String name) {
      if (target == MATH) {
        return new MethodRef(MATH, name);
      }
      if ("join".equals(name) && target instanceof List) {
        return new MethodRef(target, name);
      }
      return JsValues.getProperty(target, name);
    }

    private Object call(Object callee, List<Object> args) {
      if (!(callee instanceof MethodRef)) {
        throw unsupported();
      }
      MethodRef ref = (MethodRef) callee;
      Object arg = args.isEmpty() ? Undefined.INSTANCE : args.get(0);
      if (ref.target == MATH) {
        double x = JsValues.toNumber(arg);
        switch (ref.name) {
          case "abs":
            return Math.abs(x);
          case "floor":
            return Math.floor(x);
          case "ceil":
            return Math.ceil(x);
          case "round":
            return Math.floor(x + 0.5);
          default:
            throw unsupported();
        }
      }
      // list.join(separator)
      String separator = JsValues.isUndefined(arg) ? "," : JsValues.toJsString(arg);
      StringBuilder sb = new StringBuilder();
      List<Object> list = JsValues.asList(ref.target);
      for (int i = 0; i < list.size(); i++) {
        if (i > 0) {
          sb.append(separator);
        }
        if (!JsValues.isNil(list.get(i))) {
          sb.append(JsValues.toJsString(list.get(i)));
        }
      }
      return sb.toString();
    }

    private List<Object> parseArguments() {
      List<Object> args = new ArrayList<>();
      skipSpaces();
      if (peek(')')) {
        pos++;
        return args;
      }
      while (true) {
        args.add(parseExpression());
        skipSpaces();
        if (peek(',')) {
          pos++;
        } else {
          expect(')');
          return args;
        }
      }
    }

    private Object parsePrimary() {
      skipSpaces();
      if (pos >= src.length()) {
        throw unsupported();
      }
      char c = src.charAt(pos);
      if (c == '(') {
        pos++;
        Object value = parseExpression();
        expect(')');
        return value;
      }
      if (c == '\'' || c == '"') {
        return parseString(c);
      }
      if (Character.isDigit(c) || (c == '-' && pos + 1 < src.length() && Character.isDigit(src.charAt(pos + 1)))) {
        int start = pos++;
        while (pos < src.length() && (Character.isDigit(src.charAt(pos)) || src.charAt(pos) == '.')) {
          pos++;
        }
        return Double.parseDouble(src.substring(start, pos));
      }
      String identifier = parseIdentifier();
      if (data.containsKey(identifier)) {
        return data.get(identifier);
      }
      switch (identifier) {
        case "Math":
          return MATH;
        case "undefined":
          return Undefined.INSTANCE;
        case "null":
          return null;
        case "true":
          return Boolean.TRUE;
        case "false":
          return Boolean.FALSE;
        default:
          throw new SatpamException("ReferenceError: " + identifier + " is not defined (in template expression '" + src.trim() + "')");
      }
    }

    private String parseString(char quote) {
      StringBuilder sb = new StringBuilder();
      pos++;
      while (pos < src.length() && src.charAt(pos) != quote) {
        char c = src.charAt(pos++);
        if (c == '\\' && pos < src.length()) {
          c = src.charAt(pos++);
        }
        sb.append(c);
      }
      expect(quote);
      return sb.toString();
    }

    private String parseIdentifier() {
      int start = pos;
      while (pos < src.length() && (Character.isLetterOrDigit(src.charAt(pos)) || src.charAt(pos) == '_' || src.charAt(pos) == '$')) {
        pos++;
      }
      if (start == pos) {
        throw unsupported();
      }
      return src.substring(start, pos);
    }

    private void skipSpaces() {
      while (pos < src.length() && Character.isWhitespace(src.charAt(pos))) {
        pos++;
      }
    }

    private boolean peek(char c) {
      return pos < src.length() && src.charAt(pos) == c;
    }

    private void expect(char c) {
      skipSpaces();
      if (!peek(c)) {
        throw unsupported();
      }
      pos++;
    }

    private SatpamException unsupported() {
      return new SatpamException("Unsupported satpam message template expression: '" + src.trim() + "'");
    }
  }
}
