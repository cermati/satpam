package com.cermati.satpam.internal;

import com.cermati.satpam.Undefined;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Expected values were produced by running the same expressions in Node.js. */
class JsValuesTest {
  @Test
  void numberToStringMatchesJs() {
    Object[][] cases = {
      {0d, "0"}, {-0d, "0"}, {1d, "1"}, {-1d, "-1"}, {0.1, "0.1"}, {0.5, "0.5"}, {1.5, "1.5"}, {-2.25, "-2.25"},
      {100d, "100"}, {1e20, "100000000000000000000"}, {1e21, "1e+21"}, {1.5e21, "1.5e+21"},
      {123456789012345680000d, "123456789012345680000"}, {1e-6, "0.000001"}, {1e-7, "1e-7"}, {1.5e-7, "1.5e-7"},
      {-0.000001, "-0.000001"}, {0.000001234, "0.000001234"}, {1d / 3, "0.3333333333333333"},
      {2d / 3, "0.6666666666666666"}, {5e-324, "5e-324"}, {1.7976931348623157e308, "1.7976931348623157e+308"},
      {9007199254740993d, "9007199254740992"}, {0.1 + 0.2, "0.30000000000000004"}, {123.456, "123.456"},
      {1e100, "1e+100"}, {Double.NaN, "NaN"}, {Double.POSITIVE_INFINITY, "Infinity"}, {Double.NEGATIVE_INFINITY, "-Infinity"}
    };
    for (Object[] c : cases) {
      assertEquals(c[1], JsValues.numberToString((Double) c[0]), "String(" + c[0] + ")");
    }
  }

  @Test
  void stringToNumberMatchesJs() {
    Object[][] cases = {
      {"", 0d}, {"  ", 0d}, {" 12 ", 12d}, {" 12　", 12d}, {"1e3", 1000d}, {"1E3", 1000d}, {"-1e-3", -0.001},
      {".5", 0.5}, {"5.", 5d}, {"+.5", 0.5}, {"-.5", -0.5}, {"0x1F", 31d}, {"0X1f", 31d}, {"-0x1F", Double.NaN},
      {"0o17", 15d}, {"0b101", 5d}, {"0b2", Double.NaN}, {"Infinity", Double.POSITIVE_INFINITY},
      {"-Infinity", Double.NEGATIVE_INFINITY}, {"+Infinity", Double.POSITIVE_INFINITY}, {"infinity", Double.NaN},
      {"NaN", Double.NaN}, {"1_000", Double.NaN}, {"1,5", Double.NaN}, {"12px", Double.NaN}, {"1d", Double.NaN},
      {"1f", Double.NaN}, {"0x", Double.NaN}, {"e5", Double.NaN}, {"1e", Double.NaN}, {"--1", Double.NaN},
      {"+-1", Double.NaN}, {"00012", 12d}, {"1.2.3", Double.NaN}, {"\n\t42\n", 42d}
    };
    for (Object[] c : cases) {
      assertEquals((Double) c[1], JsValues.toNumber(c[0]), 0, "Number(" + c[0] + ")");
    }
  }

  @Test
  void toNumberOfNonStrings() {
    assertEquals(0, JsValues.toNumber(null));
    assertTrue(Double.isNaN(JsValues.toNumber(Undefined.INSTANCE)));
    assertEquals(1, JsValues.toNumber(true));
    assertEquals(0, JsValues.toNumber(Collections.emptyList()));
    assertEquals(5, JsValues.toNumber(Collections.singletonList(5d)));
    assertTrue(Double.isNaN(JsValues.toNumber(Arrays.asList(1d, 2d))));
    assertTrue(Double.isNaN(JsValues.toNumber(new LinkedHashMap<>())));
  }

  @Test
  void toJsString() {
    assertEquals("null", JsValues.toJsString(null));
    assertEquals("undefined", JsValues.toJsString(Undefined.INSTANCE));
    assertEquals("a,,,1.5,b,c", JsValues.toJsString(Arrays.asList("a", null, Undefined.INSTANCE, 1.5, Arrays.asList("b", "c"))));
    assertEquals("[object Object]", JsValues.toJsString(new LinkedHashMap<>()));
  }

  @Test
  void equality() {
    assertTrue(JsValues.strictEquals(0d, -0d));
    assertFalse(JsValues.strictEquals(Double.NaN, Double.NaN));
    assertTrue(JsValues.sameValueZero(Double.NaN, Double.NaN));
    assertFalse(JsValues.strictEquals(1d, "1"));
    assertFalse(JsValues.strictEquals(null, Undefined.INSTANCE));
    assertFalse(JsValues.strictEquals(new LinkedHashMap<>(), new LinkedHashMap<>()));

    assertTrue(JsValues.ramdaEquals(Double.NaN, Double.NaN));
    assertFalse(JsValues.ramdaEquals(0d, -0d));
    Map<String, Object> a = new LinkedHashMap<>();
    a.put("k", Arrays.asList(1d, "x"));
    Map<String, Object> b = new LinkedHashMap<>();
    b.put("k", Arrays.asList(1d, "x"));
    assertTrue(JsValues.ramdaEquals(a, b));
  }

  @Test
  void lodashGetPaths() {
    Map<String, Object> office = new LinkedHashMap<>();
    office.put("emails", Arrays.asList("a@b.c", "d@e.f"));
    Map<String, Object> input = new LinkedHashMap<>();
    input.put("office", office);
    input.put("flat.key", "flat");

    assertEquals("d@e.f", JsValues.lodashGet(input, "office.emails[1]"));
    assertEquals("d@e.f", JsValues.lodashGet(input, "office['emails'][1]"));
    assertEquals(2d, JsValues.lodashGet(input, "office.emails.length"));
    assertEquals("flat", JsValues.lodashGet(input, "flat.key"));
    assertEquals(Undefined.INSTANCE, JsValues.lodashGet(input, "office.missing.deep"));
    assertEquals(Undefined.INSTANCE, JsValues.lodashGet(null, "x"));
  }

  @Test
  void trimUsesJsWhitespace() {
    assertEquals("a", JsValues.trim(" 　﻿  a \t\n"));
    assertEquals("\u0085a", JsValues.trim("\u0085a"));
  }
}
