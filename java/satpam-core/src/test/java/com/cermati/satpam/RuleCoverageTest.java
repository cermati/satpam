package com.cermati.satpam;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Keeps the Java port from drifting from JS: every built-in JS rule (test-fixtures/rule-names.json,
 * written by record-fixtures.js) must be ported or listed in pending-rules.txt, and every ported
 * rule must be exercised by at least one parity fixture.
 */
class RuleCoverageTest {
  private static final ObjectMapper MAPPER = new ObjectMapper();

  @Test
  void everyJsRuleIsPortedOrPending() throws IOException {
    Set<String> jsRules = jsRuleNames();
    Set<String> javaRules = new TreeSet<>(Satpam.defaultValidator().getRules().keySet());
    Set<String> pending = pendingRules();

    Set<String> missing = new TreeSet<>(jsRules);
    missing.removeAll(javaRules);
    missing.removeAll(pending);
    assertTrue(missing.isEmpty(), "JS rules neither ported nor in pending-rules.txt: " + missing);

    Set<String> javaOnly = new TreeSet<>(javaRules);
    javaOnly.removeAll(jsRules);
    assertTrue(javaOnly.isEmpty(), "Java rules that do not exist in JS: " + javaOnly);

    Set<String> portedButPending = new TreeSet<>(pending);
    portedButPending.retainAll(javaRules);
    assertTrue(portedButPending.isEmpty(), "Ported rules still listed in pending-rules.txt: " + portedButPending);
  }

  @Test
  void everyPortedRuleHasAFixture() throws IOException {
    Set<String> used = new TreeSet<>();
    for (Path file : FixtureParityTest.fixtureFiles()) {
      for (JsonNode group : MAPPER.readTree(file.toFile()).get("groups")) {
        collectRuleNames(group.get("rules"), used);
      }
    }
    Set<String> uncovered = new TreeSet<>(Satpam.defaultValidator().getRules().keySet());
    uncovered.removeAll(used);
    assertEquals(new TreeSet<>(), uncovered, "Ported rules without a parity fixture");
  }

  private static void collectRuleNames(JsonNode ruleMapping, Set<String> used) {
    if (!ruleMapping.isObject()) {
      return;
    }
    for (Map.Entry<String, JsonNode> entry : (Iterable<Map.Entry<String, JsonNode>>) ruleMapping::fields) {
      JsonNode rules = entry.getValue();
      if (rules.isObject()) {
        collectRuleNames(rules, used);
      } else if (rules.isArray()) {
        for (JsonNode rule : rules) {
          for (JsonNode single : rule.isArray() ? rule : MAPPER.createArrayNode().add(rule)) {
            try {
              used.add(SatpamValidator.createRuleObject(MAPPER.convertValue(single, Object.class)).getFullName());
            } catch (SatpamException e) {
              // Fixtures for invalid rule objects
            }
          }
        }
      }
    }
  }

  private static Set<String> jsRuleNames() throws IOException {
    JsonNode names = MAPPER.readTree(FixtureParityTest.fixturesDir().resolve("rule-names.json").toFile());
    Set<String> result = new TreeSet<>();
    names.forEach(name -> result.add(name.asText()));
    return result;
  }

  private static Set<String> pendingRules() throws IOException {
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
      RuleCoverageTest.class.getResourceAsStream("/pending-rules.txt"), StandardCharsets.UTF_8))) {
      return reader.lines()
        .map(String::trim)
        .filter(line -> !line.isEmpty() && !line.startsWith("#"))
        .collect(Collectors.toCollection(TreeSet::new));
    }
  }
}
