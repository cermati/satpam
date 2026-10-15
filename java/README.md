# satpam-java

Java port of [satpam](../README.md). It accepts the same rule JSON and gives the same results and messages as the JS library, so rules written for or stored by JS services (e.g. pandora coupon `validation`, midas joint promotion agreements) can be validated in Java services unchanged.

- Artifact: `com.cermati:satpam-java:<npm version>` on Nexus (`cermati-maven-releases` / `cermati-maven-snapshots`)
- Java 11 bytecode, so it runs on both the Java 11 and Java 21 services. The only dependency is Jackson databind.
- Status: **all 83 rules are ported** (phases 1-4). [`pending-rules.txt`](satpam-core/src/test/resources/pending-rules.txt) is where a new JS rule goes until it has a Java port.

## Usage

```groovy
implementation 'com.cermati:satpam-java:4.23.0'
```

```java
// Built-in rules, English messages
ValidationResult result = Satpam.validate(
    Map.of("name", List.of("required"),
           "phone", List.of("required", "numeric"),
           "office", Map.of("secondaryEmail", List.of("minLength:5"))),
    input);                       // Map, Jackson JsonNode or POJO

result.isSuccess();
result.getMessages();             // {phone={numeric=Phone must be a number.}, office={secondaryEmail={...}}}
```

Rules can be a `Map`/`List` tree or a Jackson `JsonNode`, so stored rule JSON works directly:

```java
JsonNode rules = objectMapper.readTree(agreement.getValidation());
Satpam.validate(rules, Map.of("itemName", item.getName(), "itemBrandId", brandId));
```

### Custom rules, locale and messages

JS configures these with setters on the module or an instance. In Java you set them once on a builder, and the result is an immutable, thread-safe validator. Build it at startup and share it, for example as a Spring bean.

```java
SatpamValidator satpam = SatpamValidator.builder()
    .locale("id")                                                   // setValidationLocale('id')
    .addRule("must-be-ironman", (value, rule, prop, input) -> "ironman".equals(value))
    .message("must-be-ironman", "<%= propertyName %> is not ironman") // setValidationMessage(...)
    .messageParamsFormatter(...)                                    // options.validationMessageParamsFormatter
    .messagePackProvider(...)                                       // options.validationMessagePackProvider
    .clock(Clock.system(ZoneId.of("Asia/Jakarta")))                 // Date.now() + process TZ, for date/time rules
    .build();

satpam.validate(rules, input);
satpam.validate(rules, input, ValidateOptions.builder().messageParamsFormatter(...).build()); // per call
```

| JS | Java |
|---|---|
| `satpam.validate(rules, input, options)` | `Satpam.validate(rules, input[, ValidateOptions])` |
| `satpam.create()` + instance setters | `SatpamValidator.builder()...build()` |
| `addCustomValidation('range:$1:$2', fn)` | `.addRule("range:$1:$2", RuleFunction)` or `.addRule(ValidatorRule)` |
| `setValidationMessage(name, string \| fn)` | `.message(name, String)` / `.message(name, Message)` |
| `setValidationLocale('id')` | `.locale("id")` |
| `{ name, shouldValidate: fn }` | `Map.of("name", "required", "shouldValidate", (ShouldValidate) (rule, root) -> ...)` |
| `{ shouldValidate: { type, mappings } }` (noes) | same JSON |
| `undefined` (missing property) | missing key, or `Undefined.INSTANCE` |
| `Date.now()` and `TZ` seen by moment | `.clock(Clock)`: its instant is "now", its zone is local time (default `Clock.systemDefaultZone()`) |

Date and time rules (`date`, `dateFormat`, `dateAfter`…, `dateTime*`, `time*`, `minimumAge`, `indonesiaIdCardNumberBirthDate`) depend on the local time zone exactly as in JS. For example, `dateAfter:YYYY-MM-DD:now::` compares calendar days in local time. Give Java services the same zone as the JS service whose rules they share, normally `Asia/Jakarta`.

The Java port deliberately has no global setters. In JS, `satpam.addCustomValidation` changes behaviour for every later caller in the process. In a multi-threaded JVM shared by many libraries, that kind of global state is easy to misuse.

Custom rules can also be registered in bulk: `.addRules(ctx.getBeansOfType(ValidatorRule.class).values())` for Spring, or `.loadRules()` for `ValidatorRule`s listed in `META-INF/services/com.cermati.satpam.ValidatorRule`.

One validator has one locale. A service that answers in several languages builds one validator per locale and picks one per request.

### Annotations

For DTOs whose rules are fixed in code, put the rules on the class instead of writing a `Map`. The annotations take the same rule strings, and `AnnotatedRules` turns them into the same rule mapping, so results and messages are identical.

```java
public class ApplicantDto {
  @Rules({"required", "minLength:3"})
  private String name;                            // "name": ["required", "minLength:3"]

  @Label("Pendapatan")                            // instead of startCase("salary")
  @Rules(value = {"required", "minValue:3900888"},
         messages = @Msg(rule = "minValue:$1", text = "<%= propertyName %> minimal IDR <%= ruleParams[0] %>"))
  private BigDecimal salary;

  @AnyOf({"email", "mobilePhoneNumber"})          // "contact": [["email", "mobilePhoneNumber"]]
  private String contact;

  @Rules("email")
  @Rules(value = "required", when = HasOffice.class)  // shouldValidate; HasOffice implements ShouldValidate
  private String officeEmail;

  @Rules("{\"name\":\"memberOf\",\"params\":[[\"S1\",\"S2\"]]}")  // JSON rule object, for non-string params
  private String education;

  @Rules("required")
  private OfficeDto office;                       // annotated type: nested mapping, plus its own rules

  // getters...
}

satpam.validateBean(dto);                         // validate(satpam.rulesFor(ApplicantDto.class), dto)
satpam.check(ApplicantDto.class);                 // at startup or in a test: fails on unknown rule names
```

- Property names are Jackson's (`@JsonProperty`, naming strategies), from the validator's `ObjectMapper`. Annotate a field or a getter of a property Jackson serializes. An annotation Jackson can't see (a private field without a getter, `@JsonIgnore`) throws instead of being skipped.
- Rule names are looked up when validating, so custom rules from the builder work in `@Rules`. A typo only throws when that rule is reached; `check(Class)` (or `checkRules(mapping)` for stored JSON) finds them all up front.
- `@Msg` wins over the validator's messages, its locale and its `MessagePackProvider`, for that property only. `@Label` replaces `startCase(propertyName)`; a `MessageParamsFormatter` that returns its own property name still wins and can read `RuleObject#getLabel()`.
- A property whose type has satpam annotations becomes a nested mapping. Its own rules go under the Java-only `$rules` key: `{"office": {"$rules": ["required"], "email": ["required"]}}`. Lists of beans are not descended into, as in JS, and a class that refers back to itself is descended into only once.
- The rule mapping is derived once per class and cached on the validator. `AnnotatedRules.of(Class)` returns it for inspection.

`$rules`, `$message` and `$label` are Java-only rule keys, and hand-written or stored mappings can use them too. JS satpam does not know them, so don't put them in rule JSON that JS services also read.

### Value semantics

Validators see values the way JS does. Numbers are `Double`, objects are `Map<String, Object>`, arrays are `List<Object>`, and a missing property is `Undefined.INSTANCE`, which is different from `null` (the `boolean` rule accepts a missing value but rejects `null`). POJOs and `BigDecimal`s are converted through Jackson. Coercion follows JS: `Number("0x1F")`, `String([1, 2])`, truthiness, `===`, ramda `equals`, lodash `get` paths such as `office.emails[0]`.

The file rules `fileType:<ext>` and `image` take a `byte[]` (a JS `Buffer`), a path (`String`, `java.nio.file.Path` or `java.io.File`), or an object with a `path`. They look only at the first 12 bytes, using the same magic numbers as JS: file-type 3.8.0 for `fileType`, and image-type 4.1.0 (file-type 10.11.0) for `image`. As in JS, a **string value is read from disk as a path**, so apply these rules to uploaded bytes or to server-side paths, never to strings from a request.

Where JS satpam throws (unknown rule, bad regex flags, `null` where JS reads a property), Java throws `SatpamException`. The message text is not guaranteed to match JS.

## JS/Java parity

`../test-fixtures/*.json` holds about 4,900 cases with the result **recorded from JS satpam**. Both implementations run them:

- JS: `test/fixtures-parity.spec.js` (part of `npm test`)
- Java: `FixtureParityTest` (part of `./gradlew test`)

`RuleCoverageTest` fails if a JS rule is neither ported nor listed in `pending-rules.txt`, or if a ported rule has no fixture.

Fixture cases run with "now" fixed at `2024-03-15T03:30:45.123Z` in `Asia/Jakarta`. A group can override this with `"options": {"now": "...", "timeZone": "..."}`. The JS runner fakes `Date.now()` and sets `process.env.TZ`, and Java passes the same `Clock` to the builder.

The date internals have their own recorded cases. `java/scripts/record-date-cases.js` writes `satpam-core/src/test/resources/date-cases.json`: about 67,000 results of `new Date(string)`, `moment(input[, format[, strict]])`, `add`, `startOf`/`endOf`, comparisons, `diff` and `format` in three time zones. `DateParityTest` replays them. Re-record it when you upgrade Node or moment.

File-rule fixtures use the placeholders `{"$bytes": "<hex>"}`, `{"$file": "<name>"}` and `{"$fileObject": "<name>"}`, which refer to the samples in `test-fixtures/files/`.

When you add or change a rule:

1. Change the JS rule in `src/validators/` and the Java rule in `satpam-core/src/main/java/com/cermati/satpam/rules/`, and register it in `BuiltInRules`.
2. Add cases to a fixture file. The `"probe": "x"` shorthand runs about 45 standard JS edge-case values through the rule, and `"inputs": [...]` adds specific inputs.
3. `npm run compile && node java/scripts/record-fixtures.js` records the expected results from JS.
   If you changed `src/data/` (e.g. the disposable email list), also run `node java/scripts/export-data.js`, which copies it into the Java resources.
4. `npm test` and `cd java && ./gradlew test`.

## Build and publish

```bash
cd java
./gradlew test
./gradlew publishToMavenLocal
./gradlew publishMainPublicationToNexusSnapshotRepository   # publishes <version>-SNAPSHOT
./gradlew publishMainPublicationToNexusReleaseRepository
```

The version lives in `java/build.gradle`. Keep it the same as `package.json`.

## Known differences

- **Regex.** `pattern:` and `regex` sources are translated from JS syntax to `java.util.regex` (`$`, `.`, `\s`, `[^]`, `[` inside a class, a lone `{`, `\v`, identity escapes and so on; see `JsRegex`). A few JS features have no Java equivalent: unbounded lookbehind, group names containing `$` or `_`, and non-Unicode-mode case folding of characters such as `ſ` and `K`. These compile differently or fail in Java.
- **`startCase`.** Property names containing emoji are split differently from lodash.
- **Dates.** moment 2.29.4 is ported for the `en` locale. `moment(string)` falls back to `new Date(string)` for strings that are neither ISO 8601 nor RFC 2822, and that fallback is a port of V8 13.6 (Node 24). Older Node versions parse some odd legacy strings differently. The era format tokens (`N…`, `yo`) are not supported and throw. Time zone rules come from the JDK's tzdata rather than Node's ICU, so the two can disagree when their tzdata versions differ.
- **`urlProtocol` and internationalized hosts.** JS uses Node's `new URL()`. Java reimplements the WHATWG URL checks that decide whether a URL parses, but converts non-ASCII hosts with `java.net.IDN` (IDNA2003) instead of UTS #46, so a few internationalized hosts (and labels longer than 63 characters) are accepted or rejected differently.

## Roadmap

1. ✅ Engine, noes, `id` locale, and string, number, array, membership and conditional rules.
2. ✅ Format and Indonesia rules: email, notDisposableEmail, not-equal-email-domain, url, urlProtocol, fqdn, hostname, ip, uuid, mongoId, creditCard, imei, phone numbers, taxId, indonesianName, indonesiaIdCardNumber{Province,ValidProvince,Gender}, ISO 8601 durations.
3. ✅ Date and time rules (`internal/date`: moment 2.29 and the V8 `Date` parser), plus `indonesiaIdCardNumberBirthDate`.
4. ✅ File rules: `fileType` and `image` (magic bytes, `internal/FileTypes`).
5. Adoption in midas (a separate change): replace the hand-written `indodana-common` validator and its `collateral/` copy with this library.
