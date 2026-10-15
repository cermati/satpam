package com.cermati.satpam;

import com.cermati.satpam.annotation.AnyOf;
import com.cermati.satpam.annotation.Label;
import com.cermati.satpam.annotation.Msg;
import com.cermati.satpam.annotation.Rules;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AnnotatedRulesTest {
  private static Map<String, Object> map(Object... keyValues) {
    Map<String, Object> result = new LinkedHashMap<>();
    for (int i = 0; i < keyValues.length; i += 2) {
      result.put((String) keyValues[i], keyValues[i + 1]);
    }
    return result;
  }

  @SuppressWarnings("unchecked")
  private static Object message(ValidationResult result, String... path) {
    Object current = result.getMessages();
    for (String key : path) {
      current = ((Map<String, Object>) current).get(key);
    }
    return current;
  }

  public static class Office {
    @Rules("required")
    public String email;
  }

  public static class Applicant {
    @Rules({"required", "minLength:3"})
    public String name;

    @Rules({"required", "minValue:3900888"})
    public BigDecimal salary;

    @AnyOf({"email", "mobilePhoneNumber"})
    public String contact;

    @Rules("{\"name\":\"memberOf\",\"params\":[[\"S1\",\"S2\"]]}")
    public String education;

    public Office office;

    public List<String> tags;
  }

  @Test
  void derivesTheSameMappingAsHandWrittenRules() {
    Map<String, Object> expected = map(
      "name", Arrays.asList("required", "minLength:3"),
      "salary", Arrays.asList("required", "minValue:3900888"),
      "contact", Collections.singletonList(Arrays.asList("email", "mobilePhoneNumber")),
      "education", Collections.singletonList(map("name", "memberOf", "params",
        Collections.singletonList(Arrays.asList("S1", "S2")))),
      "office", map("email", Collections.singletonList("required")));

    assertEquals(expected, AnnotatedRules.of(Applicant.class));

    Applicant applicant = new Applicant();
    applicant.name = "ab";
    applicant.salary = new BigDecimal("100");
    applicant.contact = "nope";
    applicant.education = "S3";
    applicant.office = new Office();
    ValidationResult byAnnotations = Satpam.validateBean(applicant);
    ValidationResult byMap = Satpam.validate(expected, applicant);

    assertFalse(byAnnotations.isSuccess());
    assertEquals(byMap.getMessages(), byAnnotations.getMessages());
    assertEquals("Name must contain at least 3 character(s).", message(byAnnotations, "name", "minLength:$1"));
    assertEquals("Email field is required.", message(byAnnotations, "office", "email", "required"));
  }

  public static class Renamed {
    @JsonProperty("full_name")
    @Rules("required")
    private String fullName;

    public String getFullName() {
      return fullName;
    }
  }

  @Test
  void usesJacksonPropertyNamesAndPrivateFieldsBehindGetters() {
    assertEquals(map("full_name", Collections.singletonList("required")), AnnotatedRules.of(Renamed.class));
    assertEquals("Full Name field is required.", message(Satpam.validateBean(new Renamed()), "full_name", "required"));
  }

  public static class WithGetterRules {
    private String code;

    @Rules("required")
    public String getCode() {
      return code;
    }
  }

  @Test
  void annotationOnGetter() {
    assertEquals(map("code", Collections.singletonList("required")), AnnotatedRules.of(WithGetterRules.class));
  }

  public static class Company {
    @Rules("required")
    public Office office;
  }

  @Test
  void nestedPropertyWithItsOwnRules() {
    assertEquals(map("office", map("$rules", Collections.singletonList("required"),
      "email", Collections.singletonList("required"))), AnnotatedRules.of(Company.class));

    ValidationResult result = Satpam.validateBean(new Company());
    assertFalse(result.isSuccess());
    assertEquals("Office field is required.", message(result, "office", "required"));
    assertEquals("Email field is required.", message(result, "office", "email", "required"));

    Company company = new Company();
    company.office = new Office();
    company.office.email = "a@b.co";
    assertTrue(Satpam.validateBean(company).isSuccess());
  }

  @Test
  void ownRulesKeyInHandWrittenMapping() {
    Map<String, Object> rules = map("office", map("$rules", Collections.singletonList("required")));
    ValidationResult result = Satpam.validate(rules, map());
    assertEquals("Office field is required.", message(result, "office", "required"));
    assertTrue(Satpam.validate(rules, map("office", map())).isSuccess());
  }

  public static class Labelled {
    @Label("Pendapatan")
    @Rules(value = {"required", "minValue:3900888"},
      messages = @Msg(rule = "minValue:$1", text = "<%= propertyName %> minimal IDR <%= ruleParams[0] %>"))
    public Integer salary;
  }

  @Test
  void labelAndMessage() {
    Labelled labelled = new Labelled();
    labelled.salary = 100;
    assertEquals("Pendapatan minimal IDR 3900888", message(Satpam.validateBean(labelled), "salary", "minValue:$1"));

    assertEquals("Pendapatan field is required.", message(Satpam.validateBean(new Labelled()), "salary", "required"));

    // The field message beats the locale and the message pack; other rules still use them
    MessagePackProvider pack = (propertyName, input, rule) ->
      Collections.singletonMap("minValue:$1", Message.of("from pack"));
    SatpamValidator id = Satpam.builder().locale("id").messagePackProvider(pack).build();
    assertEquals("Pendapatan minimal IDR 3900888", message(id.validateBean(labelled), "salary", "minValue:$1"));
    assertEquals("Input ini wajib diisi.", message(id.validateBean(new Labelled()), "salary", "required"));

    // A formatter that names the property wins, and can read the label
    MessageParamsFormatter formatter = (propertyName, value, input, rule) ->
      new MessageParamsFormatter.FormattedParams(rule.getParams(), "[" + rule.getLabel() + "]");
    ValidationResult formatted = Satpam.validateBean(new Labelled(), ValidateOptions.builder().messageParamsFormatter(formatter).build());
    assertEquals("[Pendapatan] field is required.", message(formatted, "salary", "required"));
  }

  public static class OnlyWhenFlagged implements ShouldValidate {
    @Override
    public boolean test(RuleObject rule, Object rootInputObj) {
      return Boolean.TRUE.equals(((Map<?, ?>) rootInputObj).get("validateEmail"));
    }
  }

  public static class Conditional {
    public boolean validateEmail;

    @Rules("email")
    @Rules(value = "required", when = OnlyWhenFlagged.class)
    public String email;
  }

  @Test
  void whenCondition() {
    Conditional conditional = new Conditional();
    assertTrue(Satpam.validateBean(conditional).isSuccess());

    conditional.validateEmail = true;
    ValidationResult result = Satpam.validateBean(conditional);
    assertFalse(result.isSuccess());
    assertEquals("Email field is required.", message(result, "email", "required"));
  }

  public static class Hero {
    @Rules({"required", "must-be-ironman"})
    public String name;
  }

  @Test
  void customRulesAndCheck() {
    assertThrows(SatpamException.class, () -> Satpam.defaultValidator().check(Hero.class));

    ValidatorRule ironman = new ValidatorRule() {
      @Override
      public String fullName() {
        return "must-be-ironman";
      }

      @Override
      public Message message() {
        return Message.of("<%= propertyName %> is not ironman");
      }

      @Override
      public boolean validate(Object value, RuleObject rule, String propertyName, Object inputObj) {
        return "ironman".equals(value);
      }
    };
    SatpamValidator validator = Satpam.builder().addRules(Collections.singletonList(ironman)).loadRules().build();
    validator.check(Hero.class);

    Hero hero = new Hero();
    hero.name = "thor";
    assertEquals("Name is not ironman", message(validator.validateBean(hero), "name", "must-be-ironman"));
  }

  @Test
  void checkRulesReportsUnknownNames() {
    SatpamException error = assertThrows(SatpamException.class, () -> Satpam.defaultValidator().checkRules(
      map("a", Arrays.asList("required", "nope:1"), "b", map("c", Collections.singletonList(Arrays.asList("email", "alsoNope"))))));
    assertEquals("Unknown satpam rules: [alsoNope, nope:$1]", error.getMessage());
  }

  public static class Node {
    @Rules("required")
    public String id;

    public Node parent;
  }

  @Test
  void selfReferenceIsNotDescendedTwice() {
    assertEquals(map("id", Collections.singletonList("required")), AnnotatedRules.of(Node.class));
  }

  public static class Hidden {
    @Rules("required")
    private String secret;
  }

  public static class Ignored {
    @JsonIgnore
    @Rules("required")
    public String secret;
  }

  public static class WrongMsg {
    @Rules(value = "minLength:3", messages = @Msg(rule = "minLength", text = "x"))
    public String name;
  }

  public static class BadJson {
    @Rules("{name: memberOf")
    public String name;
  }

  public static class NoRules {
    public String name;
  }

  @Test
  void orThrowVariants() {
    Applicant valid = new Applicant();
    valid.name = "Budi";
    valid.salary = new BigDecimal("4000000");
    valid.office = new Office();
    valid.office.email = "budi@example.com";
    Satpam.validateBeanOrThrow(valid);

    Applicant invalid = new Applicant();
    invalid.office = new Office();
    SatpamValidationException error = assertThrows(SatpamValidationException.class, () -> Satpam.validateBeanOrThrow(invalid));
    assertEquals(Satpam.validateBean(invalid).getMessages(), error.getResult().getMessages());
    assertFalse(error.getResult().isSuccess());
    assertEquals("Validation failed for [name, salary, office]", error.getMessage());

    Map<String, Object> rules = map("name", Collections.singletonList("required"));
    Satpam.validateOrThrow(rules, map("name", "Budi"));
    SatpamValidationException mapError = assertThrows(SatpamValidationException.class, () -> Satpam.validateOrThrow(rules, map()));
    assertEquals("Name field is required.", message(mapError.getResult(), "name", "required"));

    // A broken rule is still a SatpamException, not a validation failure
    assertThrows(SatpamException.class, () -> Satpam.validateOrThrow(map("name", Collections.singletonList("nope")), map()));
  }

  @Test
  void misuseFailsFast() {
    assertThrows(SatpamException.class, () -> AnnotatedRules.of(Hidden.class));
    assertThrows(SatpamException.class, () -> AnnotatedRules.of(Ignored.class));
    SatpamException wrongMsg = assertThrows(SatpamException.class, () -> AnnotatedRules.of(WrongMsg.class));
    assertTrue(wrongMsg.getMessage().contains("minLength:$1"), wrongMsg.getMessage());
    assertThrows(SatpamException.class, () -> AnnotatedRules.of(BadJson.class));
    assertThrows(SatpamException.class, () -> Satpam.validateBean(new NoRules()));
    assertThrows(SatpamException.class, () -> Satpam.validateBean(null));
  }
}
