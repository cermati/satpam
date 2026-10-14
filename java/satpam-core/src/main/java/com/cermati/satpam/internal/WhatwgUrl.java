package com.cermati.satpam.internal;

import java.io.ByteArrayOutputStream;
import java.math.BigInteger;
import java.net.IDN;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * The parts of the WHATWG URL parser (what Node's {@code new URL(input)} implements) that decide
 * whether an absolute URL parses, and its scheme. Path, query and fragment never fail to parse, so
 * they are skipped.
 *
 * <p>Domain-to-ASCII of non-ASCII hosts uses {@link IDN} (IDNA2003) instead of UTS #46, so a few
 * internationalized hosts are accepted or rejected differently from Node.
 */
public final class WhatwgUrl {
  private static final Set<String> SPECIAL_SCHEMES = new HashSet<>(Arrays.asList("ftp", "file", "http", "https", "ws", "wss"));
  private static final String FORBIDDEN_HOST_CODE_POINTS = "\u0000\t\n\r #/:<>?@[\\]^|";

  private WhatwgUrl() {
  }

  /** The lowercased scheme of {@code input} if {@code new URL(input)} succeeds, otherwise {@code null}. */
  public static String parseScheme(String input) {
    String s = removeTabAndNewline(stripC0ControlOrSpace(input));
    if (s.isEmpty() || !isAsciiAlpha(s.charAt(0))) {
      return null;
    }
    int colon = 1;
    while (colon < s.length() && isSchemeChar(s.charAt(colon))) {
      colon++;
    }
    if (colon >= s.length() || s.charAt(colon) != ':') {
      return null;
    }
    String scheme = s.substring(0, colon).toLowerCase(Locale.ROOT);
    String rest = s.substring(colon + 1);

    if ("file".equals(scheme)) {
      return parseFile(rest) ? scheme : null;
    }
    if (SPECIAL_SCHEMES.contains(scheme)) {
      int start = 0;
      while (start < rest.length() && isSlash(rest.charAt(start), true)) {
        start++;
      }
      return parseAuthority(rest.substring(start), true) ? scheme : null;
    }
    if (rest.startsWith("//")) {
      return parseAuthority(rest.substring(2), false) ? scheme : null;
    }
    // Opaque path or path: never fails
    return scheme;
  }

  private static boolean parseFile(String rest) {
    if (rest.length() < 2 || !isSlash(rest.charAt(0), true) || !isSlash(rest.charAt(1), true)) {
      return true;
    }
    int end = 2;
    while (end < rest.length() && !isAuthorityEnd(rest.charAt(end), true)) {
      end++;
    }
    String host = rest.substring(2, end);
    if (host.isEmpty() || isWindowsDriveLetter(host)) {
      return true;
    }
    return parseHost(host, true);
  }

  private static boolean parseAuthority(String rest, boolean special) {
    int end = 0;
    while (end < rest.length() && !isAuthorityEnd(rest.charAt(end), special)) {
      end++;
    }
    String authority = rest.substring(0, end);
    int at = authority.lastIndexOf('@');
    String hostAndPort = at >= 0 ? authority.substring(at + 1) : authority;
    if (at >= 0 && hostAndPort.isEmpty()) {
      return false;
    }

    // Host state: the first ':' outside brackets starts the port
    boolean insideBrackets = false;
    int portStart = -1;
    for (int i = 0; i < hostAndPort.length(); i++) {
      char c = hostAndPort.charAt(i);
      if (c == ':' && !insideBrackets) {
        portStart = i;
        break;
      }
      if (c == '[') {
        insideBrackets = true;
      } else if (c == ']') {
        insideBrackets = false;
      }
    }
    String host = portStart >= 0 ? hostAndPort.substring(0, portStart) : hostAndPort;
    if (host.isEmpty() && (special || portStart >= 0)) {
      return false;
    }
    if (!host.isEmpty() && !parseHost(host, special)) {
      return false;
    }
    if (portStart >= 0) {
      String port = hostAndPort.substring(portStart + 1);
      for (int i = 0; i < port.length(); i++) {
        if (port.charAt(i) < '0' || port.charAt(i) > '9') {
          return false;
        }
      }
      return port.isEmpty() || new BigInteger(port).compareTo(BigInteger.valueOf(65535)) <= 0;
    }
    return true;
  }

  private static boolean parseHost(String input, boolean special) {
    if (input.startsWith("[")) {
      return input.endsWith("]") && isIpv6(input.substring(1, input.length() - 1));
    }
    if (!special) {
      for (int i = 0; i < input.length(); i++) {
        if (FORBIDDEN_HOST_CODE_POINTS.indexOf(input.charAt(i)) >= 0) {
          return false;
        }
      }
      return true;
    }
    String domain = percentDecode(input);
    String ascii = domainToAscii(domain);
    if (ascii == null || ascii.isEmpty()) {
      return false;
    }
    for (int i = 0; i < ascii.length(); i++) {
      char c = ascii.charAt(i);
      if (c <= 0x1f || c == '%' || c == 0x7f || FORBIDDEN_HOST_CODE_POINTS.indexOf(c) >= 0) {
        return false;
      }
    }
    return !endsInNumber(ascii) || isIpv4(ascii);
  }

  private static String domainToAscii(String domain) {
    StringBuilder out = new StringBuilder();
    // UTS #46 also treats these full stops as label separators
    List<String> labels = JsValues.split(domain.replace('。', '.').replace('．', '.').replace('｡', '.'), ".");
    for (int i = 0; i < labels.size(); i++) {
      if (i > 0) {
        out.append('.');
      }
      String label = labels.get(i);
      if (isAscii(label)) {
        out.append(label.toLowerCase(Locale.ROOT));
      } else {
        try {
          out.append(IDN.toASCII(label, IDN.ALLOW_UNASSIGNED).toLowerCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
          return null;
        }
      }
    }
    return out.toString();
  }

  private static boolean endsInNumber(String host) {
    List<String> parts = JsValues.split(host, ".");
    if (parts.get(parts.size() - 1).isEmpty()) {
      if (parts.size() == 1) {
        return false;
      }
      parts.remove(parts.size() - 1);
    }
    String last = parts.get(parts.size() - 1);
    if (!last.isEmpty() && last.chars().allMatch(c -> c >= '0' && c <= '9')) {
      return true;
    }
    return ipv4Number(last) != null;
  }

  private static boolean isIpv4(String host) {
    List<String> parts = JsValues.split(host, ".");
    if (parts.get(parts.size() - 1).isEmpty() && parts.size() > 1) {
      parts.remove(parts.size() - 1);
    }
    if (parts.size() > 4) {
      return false;
    }
    BigInteger[] numbers = new BigInteger[parts.size()];
    for (int i = 0; i < parts.size(); i++) {
      numbers[i] = ipv4Number(parts.get(i));
      if (numbers[i] == null) {
        return false;
      }
    }
    BigInteger max255 = BigInteger.valueOf(255);
    for (int i = 0; i < numbers.length - 1; i++) {
      if (numbers[i].compareTo(max255) > 0) {
        return false;
      }
    }
    return numbers[numbers.length - 1].compareTo(BigInteger.valueOf(256).pow(5 - numbers.length)) < 0;
  }

  private static BigInteger ipv4Number(String input) {
    if (input.isEmpty()) {
      return null;
    }
    int radix = 10;
    String digits = input;
    if (digits.length() >= 2 && (digits.startsWith("0x") || digits.startsWith("0X"))) {
      digits = digits.substring(2);
      radix = 16;
    } else if (digits.length() >= 2 && digits.charAt(0) == '0') {
      digits = digits.substring(1);
      radix = 8;
    }
    if (digits.isEmpty()) {
      return BigInteger.ZERO;
    }
    for (int i = 0; i < digits.length(); i++) {
      if (Character.digit(digits.charAt(i), radix) < 0 || digits.charAt(i) > 'f') {
        return null;
      }
    }
    return new BigInteger(digits, radix);
  }

  private static boolean isIpv6(String input) {
    int[] address = new int[8];
    int pieceIndex = 0;
    int compress = -1;
    int pointer = 0;
    int n = input.length();
    if (pointer < n && input.charAt(pointer) == ':') {
      if (pointer + 1 >= n || input.charAt(pointer + 1) != ':') {
        return false;
      }
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (pointer < n) {
      if (pieceIndex == 8) {
        return false;
      }
      if (input.charAt(pointer) == ':') {
        if (compress != -1) {
          return false;
        }
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      int value = 0;
      int length = 0;
      while (length < 4 && pointer < n && isAsciiHex(input.charAt(pointer))) {
        value = value * 16 + Character.digit(input.charAt(pointer), 16);
        pointer++;
        length++;
      }
      if (pointer < n && input.charAt(pointer) == '.') {
        if (length == 0) {
          return false;
        }
        pointer -= length;
        if (pieceIndex > 6) {
          return false;
        }
        int numbersSeen = 0;
        while (pointer < n) {
          int ipv4Piece = -1;
          if (numbersSeen > 0) {
            if (input.charAt(pointer) == '.' && numbersSeen < 4) {
              pointer++;
            } else {
              return false;
            }
          }
          if (pointer >= n || !isAsciiDigit(input.charAt(pointer))) {
            return false;
          }
          while (pointer < n && isAsciiDigit(input.charAt(pointer))) {
            int number = input.charAt(pointer) - '0';
            if (ipv4Piece == -1) {
              ipv4Piece = number;
            } else if (ipv4Piece == 0) {
              return false;
            } else {
              ipv4Piece = ipv4Piece * 10 + number;
            }
            if (ipv4Piece > 255) {
              return false;
            }
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) {
            pieceIndex++;
          }
        }
        if (numbersSeen != 4) {
          return false;
        }
        break;
      } else if (pointer < n && input.charAt(pointer) == ':') {
        pointer++;
        if (pointer >= n) {
          return false;
        }
      } else if (pointer < n) {
        return false;
      }
      address[pieceIndex] = value;
      pieceIndex++;
    }
    return compress != -1 || pieceIndex == 8;
  }

  private static String percentDecode(String input) {
    if (input.indexOf('%') < 0) {
      return input;
    }
    byte[] bytes = input.getBytes(StandardCharsets.UTF_8);
    ByteArrayOutputStream out = new ByteArrayOutputStream(bytes.length);
    for (int i = 0; i < bytes.length; i++) {
      if (bytes[i] == '%' && i + 2 < bytes.length
        && Character.digit(bytes[i + 1], 16) >= 0 && Character.digit(bytes[i + 2], 16) >= 0) {
        out.write(Character.digit(bytes[i + 1], 16) * 16 + Character.digit(bytes[i + 2], 16));
        i += 2;
      } else {
        out.write(bytes[i]);
      }
    }
    return new String(out.toByteArray(), StandardCharsets.UTF_8);
  }

  private static String stripC0ControlOrSpace(String s) {
    int start = 0;
    int end = s.length();
    while (start < end && s.charAt(start) <= 0x20) {
      start++;
    }
    while (end > start && s.charAt(end - 1) <= 0x20) {
      end--;
    }
    return s.substring(start, end);
  }

  private static String removeTabAndNewline(String s) {
    return s.replace("\t", "").replace("\n", "").replace("\r", "");
  }

  private static boolean isAuthorityEnd(char c, boolean special) {
    return c == '/' || c == '?' || c == '#' || (special && c == '\\');
  }

  private static boolean isSlash(char c, boolean special) {
    return c == '/' || (special && c == '\\');
  }

  private static boolean isWindowsDriveLetter(String s) {
    return s.length() == 2 && isAsciiAlpha(s.charAt(0)) && (s.charAt(1) == ':' || s.charAt(1) == '|');
  }

  private static boolean isSchemeChar(char c) {
    return isAsciiAlpha(c) || isAsciiDigit(c) || c == '+' || c == '-' || c == '.';
  }

  private static boolean isAscii(String s) {
    for (int i = 0; i < s.length(); i++) {
      if (s.charAt(i) > 0x7f) {
        return false;
      }
    }
    return true;
  }

  private static boolean isAsciiAlpha(char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  }

  private static boolean isAsciiDigit(char c) {
    return c >= '0' && c <= '9';
  }

  private static boolean isAsciiHex(char c) {
    return isAsciiDigit(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
  }
}
