package com.cermati.satpam;

/**
 * Static shortcut, mirrors JS {@code satpam.validate(rules, input, options)} with the built-in
 * rules and English messages.
 *
 * <p>For custom rules, a locale or message overrides, build a {@link SatpamValidator} once with
 * {@link #builder()} and reuse it. There are no global setters: unlike JS
 * {@code satpam.addCustomValidation}, nothing here changes behaviour for other callers in the JVM.
 *
 * <pre>{@code
 * ValidationResult result = Satpam.validate(
 *     Map.of("name", List.of("required"), "phone", List.of("required", "numeric")),
 *     input);
 * }</pre>
 */
public final class Satpam {
  private static final SatpamValidator DEFAULT = SatpamValidator.builder().build();

  private Satpam() {
  }

  public static ValidationResult validate(Object ruleMapping, Object input) {
    return DEFAULT.validate(ruleMapping, input);
  }

  public static ValidationResult validate(Object ruleMapping, Object input, ValidateOptions options) {
    return DEFAULT.validate(ruleMapping, input, options);
  }

  /** Validates a bean against its class's annotations, see {@link SatpamValidator#validateBean(Object)}. */
  public static ValidationResult validateBean(Object bean) {
    return DEFAULT.validateBean(bean);
  }

  public static ValidationResult validateBean(Object bean, ValidateOptions options) {
    return DEFAULT.validateBean(bean, options);
  }

  /** See {@link SatpamValidator#validateOrThrow(Object, Object)}. */
  public static void validateOrThrow(Object ruleMapping, Object input) {
    DEFAULT.validateOrThrow(ruleMapping, input);
  }

  /** See {@link SatpamValidator#validateBeanOrThrow(Object)}. */
  public static void validateBeanOrThrow(Object bean) {
    DEFAULT.validateBeanOrThrow(bean);
  }

  /** Same as {@link SatpamValidator#builder()}. */
  public static SatpamValidator.Builder builder() {
    return SatpamValidator.builder();
  }

  /** The shared validator with built-in rules and English messages. */
  public static SatpamValidator defaultValidator() {
    return DEFAULT;
  }
}
