# satpam-java

Java port of [satpam](../README.md). It accepts the same rule JSON and gives the same results and messages as the JS library, so rules written for or stored by JS services (e.g. pandora coupon `validation`, midas joint promotion agreements) can be validated in Java services unchanged.

- Artifact: `com.cermati:satpam-java:<npm version>` on Nexus (`cermati-maven-releases` / `cermati-maven-snapshots`)
- Java 11 bytecode, so it runs on both the Java 11 and Java 21 services. The only dependency is Jackson databind.
- Status: **phase 1**, which covers the engine and 42 of the 83 rules. The rules not ported yet are listed in [`pending-rules.txt`](satpam-core/src/test/resources/pending-rules.txt).

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

The Java port deliberately has no global setters. In JS, `satpam.addCustomValidation` changes behaviour for every later caller in the process. In a multi-threaded JVM shared by many libraries, that kind of global state is easy to misuse.

### Value semantics

Validators see values the way JS does. Numbers are `Double`, objects are `Map<String, Object>`, arrays are `List<Object>`, and a missing property is `Undefined.INSTANCE`, which is different from `null` (the `boolean` rule accepts a missing value but rejects `null`). POJOs and `BigDecimal`s are converted through Jackson. Coercion follows JS: `Number("0x1F")`, `String([1, 2])`, truthiness, `===`, ramda `equals`, lodash `get` paths such as `office.emails[0]`.

Where JS satpam throws (unknown rule, bad regex flags, `null` where JS reads a property), Java throws `SatpamException`. The message text is not guaranteed to match JS.

## JS/Java parity

`../test-fixtures/*.json` holds about 2,000 cases with the result **recorded from JS satpam**. Both implementations run them:

- JS: `test/fixtures-parity.spec.js` (part of `npm test`)
- Java: `FixtureParityTest` (part of `./gradlew test`)

`RuleCoverageTest` fails if a JS rule is neither ported nor listed in `pending-rules.txt`, or if a ported rule has no fixture.

When you add or change a rule:

1. Change the JS rule in `src/validators/` and the Java rule in `satpam-core/src/main/java/com/cermati/satpam/rules/`, and register it in `BuiltInRules`.
2. Add cases to a fixture file. The `"probe": "x"` shorthand runs about 45 standard JS edge-case values through the rule, and `"inputs": [...]` adds specific inputs.
3. `npm run compile && node java/scripts/record-fixtures.js` records the expected results from JS.
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

## Roadmap

1. ✅ Engine, noes, `id` locale, and string, number, array, membership and conditional rules.
2. Format and Indonesia rules: email, notDisposableEmail, url, fqdn, hostname, ip, uuid, mongoId, creditCard, imei, phone numbers, taxId, indonesianName, indonesiaIdCardNumber*, ISO-8601 durations.
3. Date and time rules, through a moment-compatible format and parser.
4. File rules: fileType and image (magic bytes).
