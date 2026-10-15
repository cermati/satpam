package com.cermati.satpam.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Message for one rule of a {@link Rules} or {@link AnyOf}, as a template like
 * {@code "<%= propertyName %> minimal IDR <%= ruleParams[0] %>"}. It wins over the validator's
 * messages, its locale and its {@code MessagePackProvider}.
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({})
public @interface Msg {
  /** Rule fullName, e.g. {@code minValue:$1} for {@code minValue:3900888}. */
  String rule();

  String text();
}
