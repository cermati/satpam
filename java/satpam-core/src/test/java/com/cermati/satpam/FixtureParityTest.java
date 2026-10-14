package com.cermati.satpam;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;
import org.junit.jupiter.api.DynamicContainer;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.TestFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * The Java half of the JS/Java parity check: every case in the shared test-fixtures/*.json (whose
 * expected results were recorded from JS satpam) must give the same result here.
 * The JS half is test/fixtures-parity.spec.js.
 */
class FixtureParityTest {
  private static final ObjectMapper MAPPER = new ObjectMapper();

  static Path fixturesDir() {
    return Path.of(System.getProperty("satpam.fixturesDir", "../../test-fixtures"));
  }

  static List<Path> fixtureFiles() throws IOException {
    try (Stream<Path> files = Files.list(fixturesDir())) {
      return files
        .filter(file -> file.toString().endsWith(".json") && !file.getFileName().toString().equals("rule-names.json"))
        .sorted()
        .collect(Collectors.toList());
    }
  }

  @TestFactory
  List<DynamicNode> fixtures() throws IOException {
    List<DynamicNode> containers = new ArrayList<>();
    for (Path file : fixtureFiles()) {
      JsonNode fixture = MAPPER.readTree(file.toFile());
      List<DynamicNode> tests = new ArrayList<>();
      for (JsonNode group : fixture.get("groups")) {
        SatpamValidator validator = createValidator(group.path("options"));
        int index = 0;
        for (JsonNode testCase : group.get("cases")) {
          String name = group.get("name").asText() + " #" + index++ + " " + testCase.path("input");
          tests.add(DynamicTest.dynamicTest(name, () -> runCase(validator, group.get("rules"), testCase)));
        }
      }
      containers.add(DynamicContainer.dynamicContainer(file.getFileName().toString(), tests));
    }
    return containers;
  }

  /** Same defaults as java/scripts/fixture-runner.js. */
  static final String DEFAULT_NOW = "2024-03-15T03:30:45.123Z";
  static final String DEFAULT_TIME_ZONE = "Asia/Jakarta";

  static SatpamValidator createValidator(JsonNode options) {
    SatpamValidator.Builder builder = SatpamValidator.builder()
      .clock(Clock.fixed(Instant.parse(options.path("now").asText(DEFAULT_NOW)),
        ZoneId.of(options.path("timeZone").asText(DEFAULT_TIME_ZONE))));
    if (options.has("locale")) {
      builder.locale(options.get("locale").asText());
    }
    Iterator<Map.Entry<String, JsonNode>> messages = options.path("messages").fields();
    while (messages.hasNext()) {
      Map.Entry<String, JsonNode> message = messages.next();
      builder.message(message.getKey(), message.getValue().asText());
    }
    return builder.build();
  }

  private static void runCase(SatpamValidator validator, JsonNode rules, JsonNode testCase) {
    JsonNode input = testCase.has("input") ? testCase.get("input") : MissingNode.getInstance();
    if (testCase.has("expectedError")) {
      assertThrows(SatpamException.class, () -> validator.validate(rules, input),
        "JS throws: " + testCase.get("expectedError").asText());
      return;
    }
    ValidationResult result = validator.validate(rules, input);
    JsonNode expected = testCase.get("expected");
    assertEquals(expected.get("messages"), MAPPER.valueToTree(result.getMessages()), "messages");
    assertEquals(expected.get("success").asBoolean(), result.isSuccess(), "success");
  }
}
