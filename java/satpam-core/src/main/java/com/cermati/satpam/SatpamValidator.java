package com.cermati.satpam;

import com.cermati.satpam.internal.JsValues;
import com.cermati.satpam.internal.MessageTemplate;
import com.cermati.satpam.internal.Noes;
import com.cermati.satpam.internal.Normalizer;
import com.cermati.satpam.internal.StartCase;
import com.cermati.satpam.locale.Locales;
import com.cermati.satpam.rules.BuiltInRules;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A satpam validator: the Java port of the JS {@code Validator} returned by {@code satpam.create()}.
 *
 * <p>Instances are immutable and thread-safe. Everything JS configures through setters
 * ({@code addCustomValidation}, {@code setValidationMessage}, {@code setValidationLocale}) is set
 * once on the {@link Builder}, so build one validator at startup and share it (e.g. as a Spring bean).
 *
 * <pre>{@code
 * SatpamValidator satpam = SatpamValidator.builder()
 *     .locale("id")
 *     .addRule("must-be-ironman", (value, rule, prop, input) -> "ironman".equals(value))
 *     .message("must-be-ironman", "Not ironman D:")
 *     .build();
 *
 * ValidationResult result = satpam.validate(
 *     Map.of("name", List.of("required", "minLength:3")),
 *     Map.of("name", "ab"));
 * result.getMessages(); // {name={minLength:$1=Name must contain at least 3 character(s).}}
 * }</pre>
 *
 * <p>Rules and input can be {@code Map}/{@code List} trees, Jackson {@code JsonNode}s or POJOs
 * (converted with the builder's {@link ObjectMapper}). The rule format is the same JSON as JS
 * satpam, so rules stored by JS services can be validated here unchanged.
 */
public final class SatpamValidator {
  private static final ShouldValidate ALWAYS = (rule, root) -> true;
  private static final MessageParamsFormatter DEFAULT_PARAMS_FORMATTER =
    (propertyName, propertyValue, inputObj, violatedRule) ->
      new MessageParamsFormatter.FormattedParams(violatedRule.getParams(), StartCase.startCase(propertyName));

  private final Map<String, RuleFunction> rules;
  private final Map<String, Message> messages;
  private final MessageParamsFormatter messageParamsFormatter;
  private final MessagePackProvider messagePackProvider;
  private final Normalizer normalizer;

  private SatpamValidator(Builder builder) {
    this.rules = Collections.unmodifiableMap(new LinkedHashMap<>(builder.rules));
    this.messages = Collections.unmodifiableMap(new LinkedHashMap<>(builder.messages));
    this.messageParamsFormatter = builder.messageParamsFormatter;
    this.messagePackProvider = builder.messagePackProvider;
    this.normalizer = new Normalizer(builder.objectMapper);
  }

  public static Builder builder() {
    return new Builder();
  }

  /** Rules by fullName, including custom ones. */
  public Map<String, RuleFunction> getRules() {
    return rules;
  }

  /** Message templates by rule fullName, after locale and message overrides. */
  public Map<String, Message> getMessages() {
    return messages;
  }

  /**
   * Validates {@code input} against {@code ruleMapping}, mirrors JS {@code validator.validate(rules, input)}.
   *
   * @throws SatpamException for an unknown rule (unless its {@code shouldValidate} skips it), and
   *   wherever JS satpam throws
   */
  public ValidationResult validate(Object ruleMapping, Object input) {
    return validate(ruleMapping, input, null);
  }

  /** Same as {@link #validate(Object, Object)} with per-call options (JS third argument). */
  public ValidationResult validate(Object ruleMapping, Object input, ValidateOptions options) {
    Object normalizedRules = normalizer.normalize(ruleMapping);
    Object normalizedInput = normalizer.normalize(input);
    MessageParamsFormatter formatter = options != null && options.getMessageParamsFormatter() != null
      ? options.getMessageParamsFormatter()
      : messageParamsFormatter;
    MessagePackProvider packProvider = options != null && options.getMessagePackProvider() != null
      ? options.getMessagePackProvider()
      : messagePackProvider;
    try {
      return validateMapping(normalizedRules, normalizedInput, normalizedInput, formatter, packProvider);
    } catch (IllegalArgumentException e) {
      // JS TypeErrors/SyntaxErrors raised while validating
      throw new SatpamException(e.getMessage(), e);
    }
  }

  private ValidationResult validateMapping(Object ruleMapping, Object inputObj, Object rootInputObj,
                                           MessageParamsFormatter formatter, MessagePackProvider packProvider) {
    boolean success = true;
    Map<String, Object> messageObj = new LinkedHashMap<>();
    if (!(ruleMapping instanceof Map)) {
      // R.keys of a non-object is []
      return new ValidationResult(true, messageObj);
    }

    for (Map.Entry<String, Object> entry : jsKeyOrder(JsValues.asMap(ruleMapping))) {
      String propertyName = entry.getKey();
      Object ruleArray = entry.getValue();
      Object value = JsValues.lodashGet(inputObj, propertyName);

      if (!(ruleArray instanceof List)) {
        // Nested rule mapping
        ValidationResult nested = validateMapping(ruleArray, value, rootInputObj, formatter, packProvider);
        success = nested.isSuccess() && success;
        if (!nested.isSuccess()) {
          messageObj.put(propertyName, new LinkedHashMap<>(nested.getMessages()));
        }
        continue;
      }

      for (Object rule : JsValues.asList(ruleArray)) {
        if (rule instanceof List) {
          // Any-of group: passes if any sub-rule passes, otherwise reports all of them
          List<RuleOutcome> outcomes = new ArrayList<>();
          boolean anyPassed = false;
          for (Object subRule : JsValues.asList(rule)) {
            RuleOutcome outcome = validateRule(subRule, value, propertyName, inputObj, rootInputObj, formatter, packProvider);
            outcomes.add(outcome);
            anyPassed = anyPassed || outcome.success;
          }
          if (!anyPassed) {
            success = false;
            for (RuleOutcome outcome : outcomes) {
              setMessage(messageObj, propertyName, outcome);
            }
          }
        } else {
          RuleOutcome outcome = validateRule(rule, value, propertyName, inputObj, rootInputObj, formatter, packProvider);
          if (!outcome.success) {
            success = false;
            setMessage(messageObj, propertyName, outcome);
          }
        }
      }
    }
    return new ValidationResult(success, messageObj);
  }

  private static void setMessage(Map<String, Object> messageObj, String propertyName, RuleOutcome outcome) {
    @SuppressWarnings("unchecked")
    Map<String, Object> propertyMessages = (Map<String, Object>) messageObj.computeIfAbsent(propertyName, k -> new LinkedHashMap<>());
    propertyMessages.put(outcome.ruleName, outcome.message);
  }

  private RuleOutcome validateRule(Object rule, Object value, String propertyName, Object inputObj, Object rootInputObj,
                                   MessageParamsFormatter formatter, MessagePackProvider packProvider) {
    RuleObject ruleObj = createRuleObject(rule);
    if (!ruleObj.getShouldValidate().test(ruleObj, rootInputObj)) {
      return new RuleOutcome(true, ruleObj.getFullName(), "");
    }

    RuleFunction validate = rules.get(ruleObj.getFullName());
    if (validate == null) {
      throw new SatpamException(ruleObj.getFullName() + " is not a valid satpam validation rule. Rule object: " + describe(ruleObj));
    }

    if (validate.validate(value, ruleObj, propertyName, inputObj)) {
      return new RuleOutcome(true, ruleObj.getFullName(), "");
    }
    String message = getValidationMessage(ruleObj, propertyName, value, inputObj, formatter, packProvider);
    return new RuleOutcome(false, ruleObj.getFullName(), message);
  }

  /** Port of JS {@code Validator._createRuleObject}. */
  static RuleObject createRuleObject(Object rule) {
    String name;
    String fullName = null;
    List<Object> params;
    ShouldValidate shouldValidate = null;

    if (rule instanceof String) {
      List<String> split = Arrays.asList(((String) rule).split(":", -1));
      name = split.get(0);
      params = new ArrayList<>(split.subList(1, split.size()));
    } else {
      Object ruleName = JsValues.lodashGet(rule, "name");
      Object ruleFullName = JsValues.lodashGet(rule, "fullName");
      Object ruleParams = JsValues.lodashGet(rule, "params");
      Object ruleShouldValidate = JsValues.lodashGet(rule, "shouldValidate");

      name = JsValues.isUndefined(ruleName) ? null : JsValues.toJsString(ruleName);
      fullName = JsValues.truthy(ruleFullName) ? JsValues.toJsString(ruleFullName) : null;
      if (!JsValues.truthy(ruleParams)) {
        params = new ArrayList<>();
      } else if (ruleParams instanceof List) {
        params = new ArrayList<>(JsValues.asList(ruleParams));
      } else {
        throw new SatpamException("Rule params must be an array, got: " + JsValues.toJsString(ruleParams));
      }

      if (ruleShouldValidate instanceof Map && Noes.shouldCreateConjunction(ruleShouldValidate)) {
        shouldValidate = (ruleObject, rootInputObj) -> Noes.satisfied(ruleShouldValidate, rootInputObj);
      } else if (ruleShouldValidate instanceof ShouldValidate) {
        shouldValidate = (ShouldValidate) ruleShouldValidate;
      } else if (JsValues.truthy(ruleShouldValidate)) {
        throw new SatpamException("TypeError: ruleObj.shouldValidate is not a function");
      }
    }

    if (fullName == null) {
      // range:1:3 -> range:$1:$2
      StringBuilder sb = new StringBuilder(name == null ? "undefined" : name);
      for (int i = 0; i < params.size(); i++) {
        sb.append(":$").append(i + 1);
      }
      fullName = sb.toString();
    }
    return new RuleObject(name, fullName, params, shouldValidate == null ? ALWAYS : shouldValidate);
  }

  /** Port of JS {@code Validator.getValidationMessage}. */
  private String getValidationMessage(RuleObject ruleObj, String propertyName, Object value, Object inputObj,
                                      MessageParamsFormatter formatter, MessagePackProvider packProvider) {
    String ruleFullName = ruleObj.getFullName();
    // JS `pack[fullName] || messages[fullName]`
    Map<String, Message> pack = packProvider == null ? messages : packProvider.provide(propertyName, inputObj, ruleObj);
    Message message = pack == null ? null : pack.get(ruleFullName);
    if (isFalsy(message)) {
      message = messages.get(ruleFullName);
    }
    String template = isFalsy(message) ? null : message.template(ruleObj, propertyName, value);

    MessageParamsFormatter.FormattedParams formatted = formatter.format(propertyName, value, inputObj, ruleObj);
    List<Object> formattedParams = formatted == null ? null : formatted.getRuleParams();
    if (formattedParams == null || formattedParams.size() != ruleObj.getParams().size()) {
      throw new SatpamException(
        "Formatted rule params length does not match original params length, are you missing something? Formatted rule params:"
          + formattedParams);
    }

    Map<String, Object> data = new LinkedHashMap<>();
    data.put("inputObj", inputObj);
    data.put("propertyName", formatted.getPropertyName() == null ? StartCase.startCase(propertyName) : formatted.getPropertyName());
    data.put("ruleName", ruleFullName);
    data.put("ruleParams", normalizer.normalize(formattedParams));
    data.put("value", value);
    return MessageTemplate.render(template, data);
  }

  private static boolean isFalsy(Message message) {
    return message == null || (message instanceof Message.Template && ((Message.Template) message).isEmpty());
  }

  /**
   * JS {@code Object.keys} order: integer-like keys ascending first, then the rest in insertion order.
   */
  private static List<Map.Entry<String, Object>> jsKeyOrder(Map<String, Object> map) {
    List<Map.Entry<String, Object>> indexKeys = new ArrayList<>();
    List<Map.Entry<String, Object>> otherKeys = new ArrayList<>();
    for (Map.Entry<String, Object> entry : map.entrySet()) {
      (isArrayIndex(entry.getKey()) ? indexKeys : otherKeys).add(entry);
    }
    if (indexKeys.isEmpty()) {
      return otherKeys;
    }
    indexKeys.sort((a, b) -> Long.compare(Long.parseLong(a.getKey()), Long.parseLong(b.getKey())));
    indexKeys.addAll(otherKeys);
    return indexKeys;
  }

  private static boolean isArrayIndex(String key) {
    if (key.isEmpty() || key.length() > 10 || (key.length() > 1 && key.charAt(0) == '0')) {
      return false;
    }
    for (int i = 0; i < key.length(); i++) {
      if (key.charAt(i) < '0' || key.charAt(i) > '9') {
        return false;
      }
    }
    return Long.parseLong(key) < 4294967295L;
  }

  private static String describe(RuleObject ruleObj) {
    return "{\"name\":" + quote(ruleObj.getName()) + ",\"params\":" + ruleObj.getParams() + ",\"fullName\":" + quote(ruleObj.getFullName()) + "}";
  }

  private static String quote(String s) {
    return s == null ? "undefined" : "\"" + s.replace("\"", "\\\"") + "\"";
  }

  private static final class RuleOutcome {
    final boolean success;
    final String ruleName;
    final String message;

    RuleOutcome(boolean success, String ruleName, String message) {
      this.success = success;
      this.ruleName = ruleName;
      this.message = message;
    }
  }

  /**
   * Configures a {@link SatpamValidator}. Starts with the built-in rules and English messages;
   * calls apply in order, so a {@link #message} after {@link #locale} overrides the locale text.
   */
  public static final class Builder {
    private final Map<String, RuleFunction> rules = new LinkedHashMap<>();
    private final Map<String, Message> messages = new LinkedHashMap<>();
    private MessageParamsFormatter messageParamsFormatter = DEFAULT_PARAMS_FORMATTER;
    private MessagePackProvider messagePackProvider;
    private ObjectMapper objectMapper = new ObjectMapper();
    /** Built-in rules still registered under their own fullName, so {@link #clock} can rebind them. */
    private final Map<String, ValidatorRule> builtIns = new LinkedHashMap<>();

    private Builder() {
      for (ValidatorRule rule : BuiltInRules.all()) {
        addRule(rule);
        builtIns.put(rule.fullName(), rule);
      }
    }

    /** Adds or replaces a rule together with its default message. */
    public Builder addRule(ValidatorRule rule) {
      rules.put(rule.fullName(), rule);
      messages.put(rule.fullName(), rule.message());
      return this;
    }

    /**
     * Adds or replaces a rule, mirrors JS {@code addCustomValidation(fullName, fn)}. The key is the
     * fullName ({@code range:$1:$2} for a rule used as {@code range:0:30}). Set its message with
     * {@link #message(String, String)}; without one the message is empty.
     */
    public Builder addRule(String fullName, RuleFunction rule) {
      rules.put(fullName, rule);
      return this;
    }

    /** Overrides a message template, mirrors JS {@code setValidationMessage(fullName, message)}. */
    public Builder message(String fullName, String template) {
      return message(fullName, Message.of(template));
    }

    /** Overrides a message, mirrors JS {@code setValidationMessage(fullName, fn)}. */
    public Builder message(String fullName, Message message) {
      messages.put(fullName, message);
      return this;
    }

    /**
     * Applies a locale's messages, mirrors JS {@code setValidationLocale(locale)}. Only {@code id}
     * exists; rules without a translation keep their current message.
     *
     * @throws SatpamException {@code Locale not found.} for an unknown locale
     */
    public Builder locale(String locale) {
      Map<String, String> localeMessages = Locales.messages(locale);
      if (localeMessages == null) {
        throw new SatpamException("Locale not found.");
      }
      localeMessages.forEach(this::message);
      return this;
    }

    /** Default for JS {@code options.validationMessageParamsFormatter}. */
    public Builder messageParamsFormatter(MessageParamsFormatter messageParamsFormatter) {
      this.messageParamsFormatter = messageParamsFormatter == null ? DEFAULT_PARAMS_FORMATTER : messageParamsFormatter;
      return this;
    }

    /** Default for JS {@code options.validationMessagePackProvider}. */
    public Builder messagePackProvider(MessagePackProvider messagePackProvider) {
      this.messagePackProvider = messagePackProvider;
      return this;
    }

    /**
     * Clock for the date and time rules: its instant is "now" ({@code Date.now()} in JS) and its
     * zone is the local time zone (the process {@code TZ} in Node). Defaults to
     * {@link Clock#systemDefaultZone()}. Rules or messages replaced with {@link #addRule} or
     * {@link #message} keep the replacement.
     */
    public Builder clock(Clock clock) {
      for (ValidatorRule rule : BuiltInRules.clockRules(clock)) {
        ValidatorRule previous = builtIns.get(rule.fullName());
        if (previous == null || rules.get(rule.fullName()) != previous) {
          continue;
        }
        rules.put(rule.fullName(), rule);
        if (messages.get(rule.fullName()) == previous.message()) {
          messages.put(rule.fullName(), rule.message());
        }
        builtIns.put(rule.fullName(), rule);
      }
      return this;
    }

    /** Mapper used to turn POJO rules/input into maps. Defaults to a plain {@code new ObjectMapper()}. */
    public Builder objectMapper(ObjectMapper objectMapper) {
      this.objectMapper = objectMapper;
      return this;
    }

    public SatpamValidator build() {
      return new SatpamValidator(this);
    }
  }
}
