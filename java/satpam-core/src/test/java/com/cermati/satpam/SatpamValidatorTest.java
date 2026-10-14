package com.cermati.satpam;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Java API behaviour that the JSON parity fixtures cannot express (functions, POJOs, builder
 * isolation). Cases mirror test/validator-wrapper/*.spec.js and test/custom-validation-messages.spec.js.
 */
class SatpamValidatorTest {
  private static final ObjectMapper MAPPER = new ObjectMapper();

  private static Map<String, Object> map(Object... keyValues) {
    Map<String, Object> result = new LinkedHashMap<>();
    for (int i = 0; i < keyValues.length; i += 2) {
      result.put((String) keyValues[i], keyValues[i + 1]);
    }
    return result;
  }

  @SuppressWarnings("unchecked")
  private static String message(ValidationResult result, String property, String rule) {
    return (String) ((Map<String, Object>) result.getMessages().get(property)).get(rule);
  }

  @Test
  void staticValidateUsesBuiltInRules() {
    ValidationResult result = Satpam.validate(
      map("name", Arrays.asList("required"), "phone", Arrays.asList("required", "numeric")),
      map("name", "Sendy", "phone", "hi there123"));

    assertFalse(result.isSuccess());
    assertEquals("Phone must be a number.", message(result, "phone", "numeric"));
    assertFalse(result.getMessages().containsKey("name"));
  }

  @Test
  void customRuleWithMessage() {
    SatpamValidator validator = Satpam.builder()
      .addRule("must-be-ironman", (value, rule, property, input) -> "ironman".equals(value))
      .message("must-be-ironman", "Not ironman D:")
      .build();
    Map<String, Object> rules = map("name", Arrays.asList("required", "must-be-ironman"), "phone", Arrays.asList("numeric"));

    assertTrue(validator.validate(rules, map("name", "ironman", "phone", 123131)).isSuccess());
    ValidationResult result = validator.validate(rules, map("name", "sendy", "phone", 123131));
    assertEquals("Not ironman D:", message(result, "name", "must-be-ironman"));
  }

  @Test
  void customRuleWithParams() {
    SatpamValidator validator = Satpam.builder()
      .addRule("range:$1:$2", (value, rule, property, input) ->
        ((Double) value) >= Double.parseDouble((String) rule.param(0)) && ((Double) value) <= Double.parseDouble((String) rule.param(1)))
      .message("range:$1:$2", "<%= propertyName %> must between <%= ruleParams[0] %> and <%= ruleParams[1] %>")
      .build();

    ValidationResult result = validator.validate(map("salary", Arrays.asList("range:0:30")), map("salary", 31));
    assertEquals("Salary must between 0 and 30", message(result, "salary", "range:$1:$2"));
  }

  @Test
  void customRuleWithoutMessageHasEmptyMessage() {
    SatpamValidator validator = Satpam.builder().addRule("never", (value, rule, property, input) -> false).build();

    ValidationResult result = validator.validate(map("x", Arrays.asList("never")), map());
    assertEquals("", message(result, "x", "never"));
  }

  @Test
  void customRulesDoNotLeakIntoOtherValidators() {
    Satpam.builder().addRule("leaky", (value, rule, property, input) -> true).build();

    assertThrows(SatpamException.class, () -> Satpam.validate(map("x", Arrays.asList("leaky")), map()));
    assertThrows(SatpamException.class, () -> Satpam.builder().build().validate(map("x", Arrays.asList("leaky")), map()));
  }

  @Test
  void validatorRuleImplementation() {
    ValidatorRule even = new ValidatorRule() {
      @Override
      public String fullName() {
        return "even";
      }

      @Override
      public Message message() {
        return Message.of("<%= propertyName %> must be even, got <%= value %>.");
      }

      @Override
      public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
        return value instanceof Double && ((Double) value) % 2 == 0;
      }
    };
    SatpamValidator validator = Satpam.builder().addRule(even).build();

    ValidationResult result = validator.validate(map("count", Arrays.asList("even")), map("count", 3));
    assertEquals("Count must be even, got 3.", message(result, "count", "even"));
  }

  @Test
  void messageFunction() {
    SatpamValidator validator = Satpam.builder()
      .message("minLength:$1", (rule, propertyName, value) -> "name: " + rule.getName() + ", fullName: " + rule.getFullName()
        + ", params: " + rule.getParams().get(0) + ", propertyName: " + propertyName + ", value: " + value)
      .build();

    ValidationResult result = validator.validate(map("name", Arrays.asList("minLength:20")), map("name", "wubwub"));
    assertEquals("name: minLength, fullName: minLength:$1, params: 20, propertyName: name, value: wubwub",
      message(result, "name", "minLength:$1"));
  }

  @Test
  void messageOverrideDoesNotAffectOtherValidators() {
    Satpam.builder().message("required", "huuu!").build();

    ValidationResult result = Satpam.validate(map("fullName", Arrays.asList("required")), map());
    assertEquals("Full Name field is required.", message(result, "fullName", "required"));
  }

  @Test
  void unknownLocale() {
    SatpamException error = assertThrows(SatpamException.class, () -> Satpam.builder().locale("xx"));
    assertEquals("Locale not found.", error.getMessage());
  }

  @Test
  void shouldValidateFunction() {
    ShouldValidate pleaseValidate = (rule, root) -> Boolean.TRUE.equals(((Map<?, ?>) root).get("pleaseValidateOfficeEmail"));
    Map<String, Object> rules = map("nested", map("office", map("email", Arrays.asList(map("name", "required", "shouldValidate", pleaseValidate)))));

    assertTrue(Satpam.validate(rules, map("pleaseValidateOfficeEmail", false)).isSuccess());
    ValidationResult result = Satpam.validate(rules, map("pleaseValidateOfficeEmail", true));
    assertFalse(result.isSuccess());
    assertEquals(Collections.singletonMap("nested", Collections.singletonMap("office",
      Collections.singletonMap("email", Collections.singletonMap("required", "Email field is required.")))), result.getMessages());
  }

  @Test
  void messageParamsFormatter() {
    Map<String, Object> rules = map("name", Arrays.asList("required"), "salary", Arrays.asList("required", "minValue:3900888"));
    MessageParamsFormatter formatter = (propertyName, value, input, rule) -> {
      List<Object> params = rule.getFullName().equals("minValue:$1")
        ? Collections.singletonList("IDR " + rule.param(0))
        : rule.getParams();
      return new MessageParamsFormatter.FormattedParams(params, null);
    };

    ValidationResult result = Satpam.validate(rules, map("name", "sendy", "salary", 3900887),
      ValidateOptions.builder().messageParamsFormatter(formatter).build());
    assertEquals("Salary must be greater than or equal to IDR 3900888.", message(result, "salary", "minValue:$1"));

    MessageParamsFormatter renaming = (propertyName, value, input, rule) ->
      new MessageParamsFormatter.FormattedParams(Collections.singletonList("IDR " + rule.param(0)), "Pendapatan");
    result = Satpam.validate(rules, map("name", "sendy", "salary", 3900887),
      ValidateOptions.builder().messageParamsFormatter(renaming).build());
    assertEquals("Pendapatan must be greater than or equal to IDR 3900888.", message(result, "salary", "minValue:$1"));
  }

  @Test
  void messageParamsFormatterMustKeepParamCount() {
    MessageParamsFormatter broken = (propertyName, value, input, rule) ->
      new MessageParamsFormatter.FormattedParams(Collections.emptyList(), null);

    assertThrows(SatpamException.class, () -> Satpam.validate(map("x", Arrays.asList("minLength:3")), map("x", "a"),
      ValidateOptions.builder().messageParamsFormatter(broken).build()));
  }

  @Test
  void messagePackProvider() {
    Map<String, Message> pack = new HashMap<>();
    pack.put("required", Message.of("Hey man, this \"<%= propertyName %>\" field is required!"));
    pack.put("memberOf:$1", Message.of("<%= propertyName %> just want one of <%= ruleParams[0] %>."));
    MessagePackProvider provider = (propertyName, input, rule) -> {
      if (propertyName.equals("name")) {
        Map<String, Message> custom = new HashMap<>(pack);
        custom.put("required", Message.of("Customized required rule for name, *evil laughs"));
        return custom;
      }
      return pack;
    };
    MessageParamsFormatter formatter = (propertyName, value, input, rule) -> {
      List<Object> params = rule.getParams();
      if (rule.getFullName().equals("memberOf:$1")) {
        List<String> parts = new ArrayList<>();
        ((List<?>) params.get(0)).forEach(item -> parts.add(String.valueOf(item)));
        params = Collections.singletonList(String.join("-", parts));
      }
      return new MessageParamsFormatter.FormattedParams(params, propertyName.toLowerCase());
    };
    Map<String, Object> rules = map(
      "name", Arrays.asList("required"),
      "salary", Arrays.asList("required", "minValue:3900888"),
      "education", Arrays.asList("required", map("fullName", "memberOf:$1", "params", Arrays.asList(Arrays.asList("S1", "S2", "S3")))));

    // Builder-level defaults, the same options can also be passed per call
    SatpamValidator validator = Satpam.builder().messagePackProvider(provider).messageParamsFormatter(formatter).build();
    ValidationResult result = validator.validate(rules, map("name", "", "salary", 3900880, "education", "s1"));

    assertEquals("Customized required rule for name, *evil laughs", message(result, "name", "required"));
    assertEquals("salary must be greater than or equal to 3900888.", message(result, "salary", "minValue:$1"));
    assertEquals("education just want one of S1-S2-S3.", message(result, "education", "memberOf:$1"));
  }

  public static class Applicant {
    public String name;
    public BigDecimal salary;
    public Office office;
  }

  public static class Office {
    public String email;
  }

  @Test
  void pojoAndJsonNodeInput() throws Exception {
    Applicant applicant = new Applicant();
    applicant.name = "";
    applicant.salary = new BigDecimal("3900887.50");
    applicant.office = new Office();
    Map<String, Object> rules = map("name", Arrays.asList("required"), "salary", Arrays.asList("minValue:3900888"),
      "office", map("email", Arrays.asList("required")));

    ValidationResult fromPojo = Satpam.validate(rules, applicant);
    ValidationResult fromJson = Satpam.validate(MAPPER.readTree(MAPPER.writeValueAsString(rules)), MAPPER.valueToTree(applicant));

    assertFalse(fromPojo.isSuccess());
    assertEquals(fromPojo.getMessages(), fromJson.getMessages());
    assertEquals("Salary must be greater than or equal to 3900888.", message(fromPojo, "salary", "minValue:$1"));
    assertNotNull(((Map<?, ?>) fromPojo.getMessages().get("office")).get("email"));
  }

  @Test
  void missingKeyIsUndefinedButNullIsNull() {
    Map<String, Object> rules = map("flag", Arrays.asList("boolean"));

    assertTrue(Satpam.validate(rules, map()).isSuccess());
    assertFalse(Satpam.validate(rules, map("flag", null)).isSuccess());
    assertTrue(Satpam.validate(rules, map("flag", Undefined.INSTANCE)).isSuccess());
  }

  @Test
  void storedRuleJsonIsValidatedUnchanged() throws Exception {
    // Shape of a stored pandora/midas joint promotion `validation` value
    String validation = "{\"itemName\": [{\"name\": \"beginWith\", \"params\": [[\"IPHONE\", \"IPAD\"]]}],"
      + " \"itemBrandId\": [{\"name\": \"some-memberOf\", \"params\": [[\"apple\", \"samsung\"]]}]}";

    assertTrue(Satpam.validate(MAPPER.readTree(validation), map("itemName", "IPHONE 15", "itemBrandId", "apple")).isSuccess());
    ValidationResult result = Satpam.validate(MAPPER.readTree(validation), map("itemName", "PIXEL 9", "itemBrandId", "google"));
    assertEquals("Item Name must begin with one of IPHONE,IPAD.", message(result, "itemName", "beginWith:$1"));
    assertEquals("Item Brand Id must be one of apple,samsung.", message(result, "itemBrandId", "some-memberOf:$1"));
  }

  @Test
  void sharedValidatorIsThreadSafe() throws Exception {
    SatpamValidator validator = Satpam.builder().locale("id").build();
    Map<String, Object> rules = map("name", Arrays.asList("required", "minLength:3"), "age", Arrays.asList("integer", "minValue:17"));
    ExecutorService pool = Executors.newFixedThreadPool(8);
    try {
      List<Future<Boolean>> futures = new ArrayList<>();
      for (int i = 0; i < 2000; i++) {
        int n = i;
        futures.add(pool.submit(() -> {
          ValidationResult result = validator.validate(rules, map("name", n % 2 == 0 ? "ab" : "abc", "age", n % 30));
          boolean expectedSuccess = n % 2 == 1 && n % 30 >= 17;
          return result.isSuccess() == expectedSuccess;
        }));
      }
      for (Future<Boolean> future : futures) {
        assertTrue(future.get());
      }
    } finally {
      pool.shutdown();
    }
  }

  @Test
  void clockSetsNowAndTimeZoneForDateRules() {
    Map<String, Object> rules = Collections.singletonMap("d", Collections.singletonList("dateAfter:YYYY-MM-DD:now::"));
    Map<String, Object> input = Collections.singletonMap("d", "2024-03-16");

    // 2024-03-15T20:00Z is already the 16th in Jakarta (UTC+7) but still the 15th in UTC
    Instant instant = Instant.parse("2024-03-15T20:00:00Z");
    SatpamValidator jakarta = SatpamValidator.builder().clock(Clock.fixed(instant, ZoneId.of("Asia/Jakarta"))).build();
    SatpamValidator utc = SatpamValidator.builder().clock(Clock.fixed(instant, ZoneId.of("UTC"))).build();

    assertFalse(jakarta.validate(rules, input).isSuccess());
    assertTrue(utc.validate(rules, input).isSuccess());
  }

  @Test
  void clockKeepsRulesAndMessagesReplacedBeforeIt() {
    SatpamValidator validator = SatpamValidator.builder()
      .addRule("date", (value, rule, prop, input) -> "custom".equals(value))
      .message("dateFormat:$1", "custom message")
      .clock(Clock.fixed(Instant.parse("2024-03-15T00:00:00Z"), ZoneId.of("UTC")))
      .build();

    Map<String, Object> rules = new LinkedHashMap<>();
    rules.put("a", Collections.singletonList("date"));
    rules.put("b", Collections.singletonList("dateFormat:YYYY"));
    Map<String, Object> input = new LinkedHashMap<>();
    input.put("a", "2024-03-15");
    input.put("b", "x");

    ValidationResult result = validator.validate(rules, input);
    // The built-in date rule accepts 2024-03-15, the custom one does not
    assertTrue(result.getMessages().containsKey("a"));
    assertEquals("custom message", ((Map<?, ?>) result.getMessages().get("b")).get("dateFormat:$1"));
  }
}
