package com.cermati.satpam.rules;

import com.cermati.satpam.ValidatorRule;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Built-in rules, the Java counterpart of the {@code validators} list in {@code src/index.js}.
 * Rules not ported yet are listed in {@code satpam-core/src/test/resources/pending-rules.txt}.
 */
public final class BuiltInRules {
  private static final List<ValidatorRule> CLOCK_INDEPENDENT_RULES = Collections.unmodifiableList(Arrays.asList(
    new Alpha(),
    new Alphanumeric(),
    new AnyBeginWith(),
    new AnyBeginWithCaseInsensitive(),
    new ArrayRule(),
    new BeginWith(),
    new Between(),
    new BooleanRule(),
    new ContainsAlphabet(),
    new ContainsDigit(),
    new ContainsLowerCase(),
    new ContainsSymbol(),
    new ContainsUpperCase(),
    new CreditCard(),
    new Email(),
    new EmptyString(),
    new Equal(),
    new EqualToField(),
    new FileType(),
    new Fqdn(),
    new Hostname(),
    new ImageRule(),
    new Imei(),
    new IndonesiaIdCardNumberGender(),
    new IndonesiaIdCardNumberProvince(),
    new IndonesiaIdCardNumberValidProvince(),
    new IndonesianName(),
    new IntegerRule(),
    new InternationalPhoneNumber(),
    new Ip(),
    new Iso8601Duration(),
    new Iso8601MaxDuration(),
    new Iso8601MinDuration(),
    new Length(),
    new MaxArraySize(),
    new MaxLength(),
    new MaxValue(),
    new MemberOf(),
    new MinArraySize(),
    new MinLength(),
    new MinValue(),
    new MobilePhoneNumber(),
    new MongoId(),
    new MultipleOf(),
    new MustHaveAllPrefixes(),
    new MustInclude(),
    new NonBlank(),
    new NonBlankItems(),
    new NotDisposableEmail(),
    new NotEqual(),
    new NotEqualEmailDomain(),
    new NotEqualToField(),
    new NotMemberOf(),
    new Numeric(),
    new PatternRule(),
    new PhoneNumber(),
    new PlainObject(),
    new Regex(),
    new Required(),
    new RequiredIf(),
    new RequiredIfNot(),
    new SomeMemberOf(),
    new StringRule(),
    new TaxId(),
    new Url(),
    new UrlProtocol(),
    new Uuid()
  ));

  private static final List<ValidatorRule> RULES = combine(Clock.systemDefaultZone());

  private BuiltInRules() {
  }

  /** All built-in rules, the date and time rules using the system clock and default time zone. */
  public static List<ValidatorRule> all() {
    return RULES;
  }

  /** The date and time rules, using {@code clock} for "now" and the local time zone. */
  public static List<ValidatorRule> clockRules(Clock clock) {
    return Collections.unmodifiableList(Arrays.asList(
      new DateRule(clock),
      new DateAfter(clock),
      new DateAfterOrEqual(clock),
      new DateBefore(clock),
      new DateBeforeOrEqual(clock),
      new DateFormat(clock),
      new DateTimeAfter(clock),
      new DateTimeAfterOrEqual(clock),
      new DateTimeBefore(clock),
      new DateTimeBeforeOrEqual(clock),
      new IndonesiaIdCardNumberBirthDate(clock),
      new MinimumAge(clock),
      new TimeAfter(clock),
      new TimeAfterOrEqual(clock),
      new TimeBefore(clock),
      new TimeBeforeOrEqual(clock)
    ));
  }

  private static List<ValidatorRule> combine(Clock clock) {
    List<ValidatorRule> rules = new ArrayList<>(CLOCK_INDEPENDENT_RULES);
    rules.addAll(clockRules(clock));
    return Collections.unmodifiableList(rules);
  }
}
