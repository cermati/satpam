package com.cermati.satpam.rules;

import com.cermati.satpam.Message;
import com.cermati.satpam.RuleObject;
import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.date.Moment;

import java.util.Locale;

/**
 * Shared part of the {@code date*} and {@code dateTime*} rules ({@code rule:format:date:offset:unit}):
 * the input and the date it is compared with, both parsed with {@code format}. {@code date} is
 * {@code now} or a date, shifted by {@code offset} {@code unit}s.
 */
final class DateComparison {
  final Moment input;
  final Moment target;
  final Object unit;

  DateComparison(Moment.Env env, Object value, RuleObject rule, String defaultUnit, String caseMethod) {
    Object format = rule.param(0);
    input = Moment.create(env, value, format, false);
    double offset = JsValues.toNumber(rule.param(2));
    unit = JsValues.truthy(rule.param(3)) ? rule.param(3) : defaultUnit;

    String date = JsValues.requireString(rule.param(1), caseMethod);
    Moment target = date.toLowerCase(Locale.ROOT).equals("now") ? Moment.now(env) : Moment.create(env, date, format, false);
    if (JsValues.truthy(offset)) {
      if (offset < 0) {
        target.subtract(Math.abs(offset), unit);
      } else {
        target.add(offset, unit);
      }
    }
    this.target = target;
  }

  /** JS sets {@code message.toString} during validate, from the sign of the offset. */
  static Message message(String defaultTemplate, String minusTemplate, String plusTemplate) {
    return (rule, propertyName, value) -> {
      double offset = JsValues.toNumber(rule.param(2));
      if (!JsValues.truthy(offset)) {
        return defaultTemplate;
      }
      return offset < 0 ? minusTemplate : plusTemplate;
    };
  }
}
