package com.cermati.satpam.rules;

import com.cermati.satpam.Message;
import com.cermati.satpam.internal.date.Moment;

import java.time.Clock;

/**
 * Base for the date and time rules. The {@link Clock} supplies "now" and the local time zone, the
 * counterparts of {@code Date.now()} and the process time zone that moment uses in Node.
 */
public abstract class ClockRule extends BaseRule {
  private final Moment.Env env;

  protected ClockRule(String fullName, Clock clock, String messageTemplate) {
    super(fullName, messageTemplate);
    this.env = new Moment.Env(clock);
  }

  protected ClockRule(String fullName, Clock clock, Message message) {
    super(fullName, message);
    this.env = new Moment.Env(clock);
  }

  protected Moment.Env env() {
    return env;
  }
}
