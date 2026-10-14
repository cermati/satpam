package com.cermati.satpam.rules;

import com.cermati.satpam.Message;
import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;
import java.util.Locale;

/**
 * Shared part of the {@code time*} rules ({@code rule:time:offset:unit}): the input (any value
 * {@code moment(value)} accepts) and {@code time}, which is {@code NOW} or a unix timestamp in
 * seconds, shifted by {@code offset} {@code unit}s ({@code unit} defaults to milliseconds).
 */
final class TimeComparison {
  final Moment input;
  final Moment target;

  TimeComparison(Moment.Env env, Object value, RuleObject rule) {
    input = Moment.create(env, value, com.cermati.satpam.Undefined.INSTANCE, false);
    double offset = JsValues.toNumber(rule.param(1));
    Object unit = rule.param(2);

    Moment target = isNow(rule) ? Moment.now(env) : Moment.unix(env, rule.param(0));
    if (JsValues.truthy(offset)) {
      if (offset < 0) {
        target.subtract(Math.abs(offset), unit);
      } else {
        target.add(offset, unit);
      }
    }
    this.target = target;
  }

  private static boolean isNow(RuleObject rule) {
    return JsValues.requireString(rule.param(0), "toUpperCase").toUpperCase(Locale.ROOT).equals("NOW");
  }

  /**
   * JS builds the message during validate: {@code base}, then " now" or the time formatted at
   * UTC+7, then the offset.
   */
  static Message message(String base, Clock clock) {
    Moment.Env env = new Moment.Env(clock);
    return (rule, propertyName, value) -> {
      StringBuilder message = new StringBuilder(base);
      if (isNow(rule)) {
        message.append(" now");
      } else {
        message.append(' ').append(Moment.unix(env, rule.param(0)).utcOffset(7).format("YYYY-MM-DD HH:mm:ssZ"));
      }
      double offset = JsValues.toNumber(rule.param(1));
      if (JsValues.truthy(offset)) {
        message.append(offset < 0
          ? " minus <%= Math.abs(ruleParams[1]) %> <%= ruleParams[2] %>"
          : " plus <%= ruleParams[1] %> <%= ruleParams[2] %>");
      }
      return message.append('.').toString();
    };
  }
}
