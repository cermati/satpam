package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

import java.util.List;

/** Port of {@code src/validators/ip.js}. */
public final class Ip extends BaseRule {
  private static final JsRegex IPV4 = JsRegex.compile("^(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)$");

  /** ip.validate on a truthy value, also used by {@link Url}. Throws for non-strings like JS. */
  static boolean isIp(Object value) {
    if (isIpv4(value)) {
      return true;
    }
    return isIpv6(JsValues.requireString(value, "split"));
  }

  private static boolean isIpv4(Object value) {
    // ipv4Regex.test(val) converts val to string, but val.split then needs a real string
    if (!IPV4.test(JsValues.toJsString(value))) {
      return false;
    }
    // parts.sort((a, b) => a - b)[3] <= 255: the largest part
    double max = 0;
    for (String part : JsValues.split(JsValues.requireString(value, "split"), ".")) {
      max = Math.max(max, Double.parseDouble(part));
    }
    return max <= 255;
  }

  private static boolean isIpv6(String value) {
    List<String> blocks = JsValues.split(value, ":");
    boolean foundOmissionBlock = false;
    boolean foundIpv4TransitionBlock = isIpv4(blocks.get(blocks.size() - 1));
    int expectedNumberOfBlocks = foundIpv4TransitionBlock ? 7 : 8;

    if (blocks.size() > expectedNumberOfBlocks) {
      return false;
    }
    if (value.equals("::")) {
      return true;
    } else if (value.startsWith("::")) {
      blocks.remove(0);
      blocks.remove(0);
      foundOmissionBlock = true;
    } else if (value.endsWith("::")) {
      blocks.remove(blocks.size() - 1);
      blocks.remove(blocks.size() - 1);
      foundOmissionBlock = true;
    }

    for (int i = 0; i < blocks.size(); ++i) {
      if (blocks.get(i).isEmpty() && i > 0 && i < blocks.size() - 1) {
        if (foundOmissionBlock) {
          return false;
        }
        foundOmissionBlock = true;
      } else if (foundIpv4TransitionBlock && i == blocks.size() - 1) {
        // already checked to be a valid IPv4 address
      } else if (!isIpv6Block(blocks.get(i))) {
        return false;
      }
    }

    if (foundOmissionBlock) {
      return blocks.size() >= 1;
    }
    return blocks.size() == expectedNumberOfBlocks;
  }

  /** {@code /^[0-9A-F]{1,4}$/i} */
  private static boolean isIpv6Block(String block) {
    if (block.isEmpty() || block.length() > 4) {
      return false;
    }
    for (int i = 0; i < block.length(); i++) {
      if (Character.digit(block.charAt(i), 16) < 0 || block.charAt(i) > 'f') {
        return false;
      }
    }
    return true;
  }

  public Ip() {
    super("ip", "<%= propertyName %> is not a valid IP address.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    return isIp(value);
  }
}
