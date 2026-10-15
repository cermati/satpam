package com.cermati.satpam.annotation;

import com.cermati.satpam.ShouldValidate;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Satpam rules for a property, in the same syntax as a rule array: {@code @Rules({"required", "minLength:3"})}
 * is {@code "name": ["required", "minLength:3"]}.
 *
 * <p>An entry starting with <code>{</code> is a JSON rule object, for params that are not strings:
 * <code>@Rules("{\"name\":\"memberOf\",\"params\":[[\"S1\",\"S2\"]]}")</code>.
 *
 * <p>Put it on a field or getter that Jackson serializes; the property name is Jackson's, so
 * {@code @JsonProperty} and naming strategies apply. Repeat it to give rules different
 * {@link #when()} conditions. Rule names are looked up when validating, so custom rules added
 * with {@code SatpamValidator.Builder#addRule} work; use {@code SatpamValidator#check(Class)} to
 * catch unknown names at startup.
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
@Repeatable(Rules.List.class)
public @interface Rules {
  String[] value();

  /** Messages for these rules, overriding the validator's messages for this property only. */
  Msg[] messages() default {};

  /**
   * Runs these rules only when it returns true (JS {@code shouldValidate}). Needs a no-arg
   * constructor; one instance is shared. The default, {@code ShouldValidate} itself, means always.
   */
  Class<? extends ShouldValidate> when() default ShouldValidate.class;

  @Documented
  @Retention(RetentionPolicy.RUNTIME)
  @Target({ElementType.FIELD, ElementType.METHOD})
  @interface List {
    Rules[] value();
  }
}
