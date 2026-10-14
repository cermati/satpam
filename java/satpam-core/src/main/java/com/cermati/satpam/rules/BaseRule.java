package com.cermati.satpam.rules;

import com.cermati.satpam.Message;
import com.cermati.satpam.ValidatorRule;

/** Base for built-in rules: a fixed fullName and a default message template. */
public abstract class BaseRule implements ValidatorRule {
  private final String fullName;
  private final Message message;

  protected BaseRule(String fullName, String messageTemplate) {
    this.fullName = fullName;
    this.message = Message.of(messageTemplate);
  }

  @Override
  public String fullName() {
    return fullName;
  }

  @Override
  public Message message() {
    return message;
  }
}
