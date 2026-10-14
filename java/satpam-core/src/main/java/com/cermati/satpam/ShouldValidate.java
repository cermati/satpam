package com.cermati.satpam;

/**
 * Decides whether a rule should run, mirrors the JS {@code shouldValidate(ruleObj, rootInputObj)}.
 * A rule that is skipped counts as passed.
 */
@FunctionalInterface
public interface ShouldValidate {
  boolean test(RuleObject rule, Object rootInputObj);
}
