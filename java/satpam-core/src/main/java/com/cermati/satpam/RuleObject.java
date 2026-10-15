package com.cermati.satpam;

import java.util.Collections;
import java.util.List;

/**
 * Parsed rule, mirrors the JS {@code ruleObj}: {@code minLength:10} becomes name {@code minLength},
 * params {@code ["10"]} and fullName {@code minLength:$1}.
 */
public final class RuleObject {
  private final String name;
  private final String fullName;
  private final List<Object> params;
  private final ShouldValidate shouldValidate;
  private final Message message;
  private final String label;

  public RuleObject(String name, String fullName, List<Object> params, ShouldValidate shouldValidate) {
    this(name, fullName, params, shouldValidate, null, null);
  }

  /**
   * @param message rule-level message ({@code $message}), or {@code null}
   * @param label display name for the property ({@code $label}), or {@code null}
   */
  public RuleObject(String name, String fullName, List<Object> params, ShouldValidate shouldValidate,
                    Message message, String label) {
    this.name = name;
    this.fullName = fullName;
    this.params = Collections.unmodifiableList(params);
    this.shouldValidate = shouldValidate;
    this.message = message;
    this.label = label;
  }

  public String getName() {
    return name;
  }

  public String getFullName() {
    return fullName;
  }

  /**
   * Rule params. Params parsed from a rule string are always strings; params given in an object
   * rule keep their JSON types (e.g. a list for {@code memberOf}).
   */
  public List<Object> getParams() {
    return params;
  }

  /**
   * Param at {@code index}, or {@link Undefined#INSTANCE} when absent (JS {@code params[i]}).
   */
  public Object param(int index) {
    return index < params.size() ? params.get(index) : Undefined.INSTANCE;
  }

  public ShouldValidate getShouldValidate() {
    return shouldValidate;
  }

  /**
   * Java-only {@code $message} of an object rule: overrides the message pack and the validator's
   * messages for this rule. {@code null} when not set.
   */
  public Message getMessage() {
    return message;
  }

  /**
   * Java-only {@code $label} of an object rule: the property's display name in messages, used
   * instead of {@code startCase(propertyName)}. {@code null} when not set.
   */
  public String getLabel() {
    return label;
  }

  @Override
  public String toString() {
    return "RuleObject{name=" + name + ", fullName=" + fullName + ", params=" + params + "}";
  }
}
