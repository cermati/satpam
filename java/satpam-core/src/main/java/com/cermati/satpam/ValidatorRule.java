package com.cermati.satpam;

/**
 * A satpam rule: its {@code fullName} key (e.g. {@code minLength:$1}), validation and default message.
 * Mirrors the {@code { fullName, validate, message }} shape of {@code src/validators/*.js}.
 *
 * <p>Implementations must be stateless: one instance is shared across threads.
 */
public interface ValidatorRule extends RuleFunction {
  String fullName();

  Message message();
}
