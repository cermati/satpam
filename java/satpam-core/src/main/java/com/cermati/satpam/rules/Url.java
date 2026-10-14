package com.cermati.satpam.rules;

import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsRegex;
import com.cermati.satpam.internal.JsValues;

import java.util.Arrays;
import java.util.List;

/** Port of {@code src/validators/url.js}. */
public final class Url extends BaseRule {
  private static final List<String> PROTOCOLS = Arrays.asList("http", "https", "ftp");
  private static final JsRegex DIGITS = JsRegex.compile("^[0-9]+$");

  public Url() {
    super("url", "<%= propertyName %> is not a valid url.");
  }

  @Override
  public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
    if (!JsValues.truthy(value)) {
      return true;
    }
    double length = value instanceof String ? ((String) value).length()
      : value instanceof List ? JsValues.asList(value).size() : Double.NaN;
    if (length >= 2083 || JsValues.hasWhitespace(JsValues.toJsString(value))) {
      return false;
    }
    if (value instanceof List) {
      // Arrays have indexOf (element search) but not split
      List<Object> list = JsValues.asList(value);
      if (!list.isEmpty() && "mailto:".equals(list.get(0))) {
        return false;
      }
      JsValues.requireString(value, "split");
    }
    String val = JsValues.requireString(value, "indexOf");
    if (val.startsWith("mailto:")) {
      return false;
    }

    List<String> split = JsValues.split(val, "://");
    if (split.size() > 1) {
      String protocol = split.remove(0);
      if (!PROTOCOLS.contains(protocol)) {
        return false;
      }
    }

    val = String.join("://", split);
    val = JsValues.split(val, "#").get(0);
    val = JsValues.split(val, "?").get(0);
    val = JsValues.split(val, "/").get(0);
    split = JsValues.split(val, "@");

    if (split.size() > 1) {
      String auth = split.remove(0);
      if (auth.indexOf(':') >= 0 && JsValues.split(auth, ":").size() > 2) {
        return false;
      }
    }

    String hostname = String.join("@", split);
    split = JsValues.split(hostname, ":");
    String host = split.remove(0);

    if (!split.isEmpty()) {
      String portStr = String.join(":", split);
      if (!DIGITS.test(portStr)) {
        return false;
      }
      double port = Double.parseDouble(portStr);
      if (port <= 0 || port > 65535) {
        return false;
      }
    }

    return host.isEmpty() || Ip.isIp(host) || Fqdn.isFqdn(host) || host.equals("localhost");
  }
}
