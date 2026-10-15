package com.cermati.satpam.annotation;

import com.cermati.satpam.ShouldValidate;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * An any-of group: passes if any of the rules passes, otherwise reports all of them.
 * {@code @AnyOf({"email", "mobilePhoneNumber"})} is {@code "contact": [["email", "mobilePhoneNumber"]]}.
 * Same entry syntax and attributes as {@link Rules}; repeat it for several groups.
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
@Repeatable(AnyOf.List.class)
public @interface AnyOf {
  String[] value();

  Msg[] messages() default {};

  Class<? extends ShouldValidate> when() default ShouldValidate.class;

  @Documented
  @Retention(RetentionPolicy.RUNTIME)
  @Target({ElementType.FIELD, ElementType.METHOD})
  @interface List {
    AnyOf[] value();
  }
}
