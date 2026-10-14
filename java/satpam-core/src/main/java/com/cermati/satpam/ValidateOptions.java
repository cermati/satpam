package com.cermati.satpam;

/**
 * Per-call options, mirrors the JS {@code satpam.validate(rules, input, options)} third argument.
 * Unset options fall back to the ones configured on {@link SatpamValidator.Builder}.
 */
public final class ValidateOptions {
  private final MessageParamsFormatter messageParamsFormatter;
  private final MessagePackProvider messagePackProvider;

  private ValidateOptions(Builder builder) {
    this.messageParamsFormatter = builder.messageParamsFormatter;
    this.messagePackProvider = builder.messagePackProvider;
  }

  public static Builder builder() {
    return new Builder();
  }

  public MessageParamsFormatter getMessageParamsFormatter() {
    return messageParamsFormatter;
  }

  public MessagePackProvider getMessagePackProvider() {
    return messagePackProvider;
  }

  public static final class Builder {
    private MessageParamsFormatter messageParamsFormatter;
    private MessagePackProvider messagePackProvider;

    private Builder() {
    }

    public Builder messageParamsFormatter(MessageParamsFormatter messageParamsFormatter) {
      this.messageParamsFormatter = messageParamsFormatter;
      return this;
    }

    public Builder messagePackProvider(MessagePackProvider messagePackProvider) {
      this.messagePackProvider = messagePackProvider;
      return this;
    }

    public ValidateOptions build() {
      return new ValidateOptions(this);
    }
  }
}
