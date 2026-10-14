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
    new EmptyString(),
    new Equal(),
    new EqualToField(),
    new IntegerRule(),
    new Length(),
    new MaxArraySize(),
    new MinArraySize(),
    new MaxLength(),
    new MaxValue(),
    new MemberOf(),
    new MinLength(),
    new MinValue(),
    new MultipleOf(),
    new MustHaveAllPrefixes(),
    new MustInclude(),
    new NonBlank(),
    new NonBlankItems(),
    new NotEqual(),
    new NotEqualToField(),
    new NotMemberOf(),
    new Numeric(),
    new PatternRule(),
    new PlainObject(),
    new Regex(),
    new Required(),
    new RequiredIf(),
    new RequiredIfNot(),
    new SomeMemberOf(),
    new StringRule()
  ));

  private BuiltInRules() {
  }

  public static List<ValidatorRule> all() {
    return RULES;
  }
}
