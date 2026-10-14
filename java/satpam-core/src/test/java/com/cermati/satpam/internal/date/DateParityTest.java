package com.cermati.satpam.internal.date;

import com.cermati.satpam.Undefined;
import com.cermati.satpam.internal.Normalizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DynamicContainer;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.TestFactory;

import java.io.IOException;
import java.io.InputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Replays date-cases.json, recorded from Node 24 and moment 2.29.4 by
 * {@code java/scripts/record-date-cases.js}, against {@link V8DateParser} and {@link Moment}.
 */
class DateParityTest {
  private static final ObjectMapper MAPPER = new ObjectMapper();
  private static final Normalizer NORMALIZER = new Normalizer(MAPPER);

  @TestFactory
  List<DynamicNode> dateCases() throws IOException {
    JsonNode data;
    try (InputStream in = DateParityTest.class.getResourceAsStream("/date-cases.json")) {
      data = MAPPER.readTree(in);
    }
    List<String> strings = texts(data.get("dateStrings"));
    List<String> formats = texts(data.get("formats"));
    List<Object> values = new ArrayList<>();
    for (JsonNode v : data.get("values")) {
      values.add(v.has("undefined") ? Undefined.INSTANCE : v.has("nan") ? (Object) Double.NaN : NORMALIZER.normalize(v.get("value")));
    }
    List<Object> addUnits = units(data.get("addUnits"));
    List<Object> startUnits = units(data.get("startUnits"));
    List<Object> diffUnits = units(data.get("diffUnits"));
    List<String> bases = texts(data.get("bases"));
    JsonNode amounts = data.get("addAmounts");

    List<DynamicNode> scenarios = new ArrayList<>();
    for (JsonNode scenario : data.get("scenarios")) {
      Clock clock = Clock.fixed(Instant.parse(scenario.get("now").asText()), ZoneId.of(scenario.get("timeZone").asText()));
      Moment.Env env = new Moment.Env(clock);
      JsDate jsDate = new JsDate(clock.getZone());
      List<DynamicTest> tests = new ArrayList<>();

      for (int i = 0; i < strings.size(); i++) {
        String s = strings.get(i);
        tests.add(check("new Date(" + quote(s) + ")", scenario.get("dateParse").get(i), () -> num(jsDate.parse(s))));
        tests.add(check("moment(" + quote(s) + ")", scenario.get("momentString").get(i), () -> ms(Moment.create(env, s, Undefined.INSTANCE, false))));
      }
      for (int i = 0; i < values.size(); i++) {
        Object v = values.get(i);
        tests.add(check("moment(" + v + ")", scenario.get("momentValue").get(i), () -> ms(Moment.create(env, v, Undefined.INSTANCE, false))));
      }
      for (int f = 0; f < formats.size(); f++) {
        String format = formats.get(f);
        for (int i = 0; i < strings.size(); i++) {
          String s = strings.get(i);
          tests.add(check("moment(" + quote(s) + ", " + quote(format) + ")", scenario.get("momentFormat").get(f).get(i),
            () -> ms(Moment.create(env, s, format, false))));
          tests.add(check("moment(" + quote(s) + ", " + quote(format) + ", true)", scenario.get("momentStrict").get(f).get(i),
            () -> ms(Moment.create(env, s, format, true))));
        }
        for (int i = 0; i < values.size(); i++) {
          Object v = values.get(i);
          tests.add(check("moment(" + v + ", " + quote(format) + ")", scenario.get("momentValueFormat").get(f).get(i),
            () -> ms(Moment.create(env, v, format, false))));
        }
      }
      for (JsonNode arrayCase : scenario.get("momentArrayFormat")) {
        Object formatList = NORMALIZER.normalize(arrayCase.get(0));
        for (int i = 0; i < arrayCase.get(1).size(); i++) {
          String s = strings.get(i);
          tests.add(check("moment(" + quote(s) + ", " + formatList + ")", arrayCase.get(1).get(i),
            () -> ms(Moment.create(env, s, formatList, false))));
        }
      }
      for (int b = 0; b < bases.size(); b++) {
        String base = bases.get(b);
        for (int u = 0; u < addUnits.size(); u++) {
          Object unit = addUnits.get(u);
          for (int n = 0; n < amounts.size(); n++) {
            double amount = amounts.get(n).asDouble();
            tests.add(check(base + ".add(" + amount + ", " + unit + ")", scenario.get("add").get(b).get(u).get(n),
              () -> ms(Moment.create(env, base, Undefined.INSTANCE, false).add(amount, unit))));
          }
          tests.add(check(base + ".subtract(3, " + unit + ")", scenario.get("subtract").get(b).get(u),
            () -> ms(Moment.create(env, base, Undefined.INSTANCE, false).subtract(3.0, unit))));
        }
        for (int u = 0; u < startUnits.size(); u++) {
          Object unit = startUnits.get(u);
          tests.add(check(base + ".startOf(" + unit + ")", scenario.get("startOf").get(b).get(u),
            () -> num(Moment.create(env, base, Undefined.INSTANCE, false).startOf(unit).valueOf())));
          tests.add(check(base + ".endOf(" + unit + ")", scenario.get("endOf").get(b).get(u),
            () -> num(Moment.create(env, base, Undefined.INSTANCE, false).endOf(unit).valueOf())));
        }
        for (int o = 0; o < bases.size(); o++) {
          String other = bases.get(o);
          for (int u = 0; u < diffUnits.size(); u++) {
            Object unit = diffUnits.get(u);
            tests.add(check(base + ".diff(" + other + ", " + unit + ")", scenario.get("diff").get(b).get(o).get(u),
              () -> num(Moment.create(env, base, Undefined.INSTANCE, false).diff(Moment.create(env, other, Undefined.INSTANCE, false), unit))));
          }
          for (int u = 0; u < startUnits.size(); u++) {
            Object unit = startUnits.get(u);
            tests.add(check(base + " vs " + other + " by " + unit, scenario.get("compare").get(b).get(o).get(u), () -> {
              Moment x = Moment.create(env, base, Undefined.INSTANCE, false);
              Moment y = Moment.create(env, other, Undefined.INSTANCE, false);
              return MAPPER.valueToTree(new boolean[] {x.isAfter(y, unit), x.isBefore(y, unit), x.isSame(y, unit),
                x.isSameOrAfter(y, unit), x.isSameOrBefore(y, unit)});
            }));
          }
        }
      }
      List<String> formatBases = new ArrayList<>(bases);
      formatBases.add("abc");
      for (int b = 0; b < formatBases.size(); b++) {
        String base = formatBases.get(b);
        tests.add(check(base + ".format()", scenario.get("format").get(b), () -> {
          Moment m = Moment.create(env, base, Undefined.INSTANCE, false);
          return MAPPER.valueToTree(new String[] {m.format("DDMMYY"), m.format("YYYY-MM-DD HH:mm:ssZ")});
        }));
      }
      String[] unixInputs = {"0", "1700000000", "-1", "1.5", "abc", "", "253402300799", "-62198755200"};
      for (int i = 0; i < unixInputs.length; i++) {
        String input = unixInputs[i];
        tests.add(check("unix(" + quote(input) + ").utcOffset(7)", scenario.get("unixAt7").get(i),
          () -> MAPPER.valueToTree(Moment.unix(env, input).utcOffset(7).format("YYYY-MM-DD HH:mm:ssZ"))));
      }
      scenarios.add(DynamicContainer.dynamicContainer(scenario.get("timeZone").asText(), tests));
    }
    return scenarios;
  }

  private static DynamicTest check(String name, JsonNode expected, Supplier<JsonNode> actual) {
    return DynamicTest.dynamicTest(name, () -> {
      JsonNode value = actual.get();
      if (expected.isNumber() && value.isNumber()) {
        assertEquals(expected.doubleValue(), value.doubleValue(), name);
      } else {
        assertEquals(expected, value, name);
      }
    });
  }

  private static JsonNode ms(Moment m) {
    return m.isValid() ? MAPPER.valueToTree(m.valueOf()) : MAPPER.nullNode();
  }

  private static JsonNode num(double d) {
    return Double.isNaN(d) || Double.isInfinite(d) ? MAPPER.nullNode() : MAPPER.valueToTree(d);
  }

  private static List<String> texts(JsonNode array) {
    List<String> list = new ArrayList<>();
    array.forEach(n -> list.add(n.asText()));
    return list;
  }

  private static List<Object> units(JsonNode array) {
    List<Object> list = new ArrayList<>();
    array.forEach(n -> list.add(n.isNull() ? Undefined.INSTANCE : n.asText()));
    return list;
  }

  private static String quote(String s) {
    return '"' + s.replace("\n", "\\n") + '"';
  }
}
