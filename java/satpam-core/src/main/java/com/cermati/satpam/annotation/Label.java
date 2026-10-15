package com.cermati.satpam.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Display name of the property in messages, instead of {@code startCase(propertyName)}.
 * A {@code MessageParamsFormatter} that returns its own property name still wins; it can read
 * this label from {@code RuleObject#getLabel()}.
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
public @interface Label {
  String value();
}
