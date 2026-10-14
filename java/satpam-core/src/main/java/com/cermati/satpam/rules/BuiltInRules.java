package com.cermati.satpam.rules;

import com.cermati.satpam.ValidatorRule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Built-in rules, the Java counterpart of the {@code validators} list in {@code src/index.js}.
 * Rules not ported yet are listed in {@code satpam-core/src/test/resources/pending-rules.txt}.
 */
public final class BuiltInRules {
  private static final List<ValidatorRule> RULES = Collections.unmodifiableList(Arrays.asList(
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
    new Fqdn(),
    new Hostname(),
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

  private BuiltInRules() {
  }

  public static List<ValidatorRule> all() {
    return RULES;
  }
}
