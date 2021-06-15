# Satpam
-----
Satpam is a javascript simple and effective object validation library.

[![Build Status](https://travis-ci.org/cermati/satpam.svg)](https://travis-ci.org/cermati/satpam)
[![npm version](https://badge.fury.io/js/satpam.svg)](https://badge.fury.io/js/satpam)


## Installation
```
npm install satpam --save
```


## Quick Usage
```js
const satpam = require('satpam');

const rules = {
  name: ['required'],
  phone: ['required', 'numeric'],
  email: ['required', 'email']
  office: {
    secondaryEmail: ['email'],
  }
};

const input = {
  name: 'Sendy',
  title: 'Lord',
  phone: 'hi there123',
  email: 'test@example.com',
  office: {
    secondaryEmail: 'invalid email',
  }
};

const result = satpam.validate(rules, input);

if (result.success === true) {
  // valid
} else {
  // invalid
  result.messages.office.secondaryEmail.email === 'Secondary Email must be email.';
  result.messages.phone.number === 'Phone must be numeric.';
}
```


## Isolated Satpam Instance
Satpam `create` method will return an isolated `Satpam` instance based on current state of satpam validation rules and messages. The instance won't be affected when you setting up a custom validation rules or messages.

- Each instance will have cloned validation rules and messages, so it's safe to add or override validation rule without affecting other validator instances or the global satpam validator.
- The cloned validation rules and messages will be based on the current state of the global satpam validator. See [Custom Rules](#custom-rules)


```js
const satpam = require('satpam');

const validatorOne = satpam.create();
const validatorTwo = satpam.create();
```

## Available Rules
- `required`
- `numeric`
- `integer`
- `email`
- `notDisposableEmail` (well suited with email validation)
- `image`
- `alpha`
- `alphanumeric`
- `boolean`
- `creditCard`
- `containsAlphabet`
- `containsDigit`
- `containsLowerCase`
- `containsUpperCase`
- `date`
- `dateFormat:<format, e.g. DD-MM-YYYY>`
- `dateAfter:<the date input format, e.g. DD-MM-YYYY>:<date after e.g. 'now' or 20-1-2015>:<offset>:<unit of time e.g. 'days'>`
- `dateBefore:<the date input format, e.g. DD-MM-YYYY>:<date after e.g. 'now' or 20-1-2015>:<offset>:<unit of time e.g. 'days'>`
- `dateTimeAfter:<the date input format, e.g. YYYY-MM-DDTHH:mm:ss.SSS[Z]>:<date time after e.g. 'now' or 20-1-2015T18:30:00.000+07>:<offset>:<unit of time e.g. 'hours'>`
- `dateTimeAfterOrEqual:<the date input format, e.g. YYYY-MM-DDTHH:mm:ss.SSS[Z]>:<date time after or equal e.g. 'now' or 20-1-2015T18:30:00.000+07>:<offset>:<unit of time e.g. 'hours'>`
- `timeAfter:<time after i.e. now or time in unix form>:<offset>:<unit of time e.g. 'minutes'>`
- `timeAfterOrEqual:<time after or equal i.e. now or time in unix form>:<offset>:<unit of time e.g. 'minutes'>`
- `url`
- `string`
- `plainObject` Check if the given value is a plani object (passing string, array, or anything will return to false)
- `nonBlank`
- `mongoId` Check if the given string is a valid mongodb object id
- `phoneNumber` (Currently only supports Indonesia phone number)
- `mobilePhoneNumber` (Currently only supports Indonesia mobile phone number)
- `length:<length>`
- `fileType:<extension>` Please check [file-type](https://github.com/sindresorhus/file-type)
- `maxLength:<length>`
- `minLength:<length>`
- `maxValue:<max value>`
- `minValue:<min value>`
- `memberOf:$1`
- `equal:$1`
- `equal-to-field:$1`

  Use object notation for defining this rule
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/equal-to-field.spec.js#L5)

- `notEqual:$1`
- `not-equal-email-domain:$1`

  `$1` is the prohibited domains separated by comma (',')
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/not-equal-email-domain.spec.js)
- `not-equal-to-field:$1`

  Use object notation for defining this rule
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/not-equal-to-field.spec.js#L5)

- `requiredIf:<fieldName>:<value>`
  ```js
  var input = {message: 'hi!'};
  // `subject` is required if message equals `hi!`
  satpam.validate({subject: 'requiredIf:message:hi!'});
  ```

  For more complex example please see
  - [`requiredIf` examples](https://github.com/cermati/satpam/blob/master/test/validators/required-if.spec.js#L147)
  - [`noes` examples](https://github.com/sendyhalim/noes)
- `requiredIfNot:<fieldName>:<value>`
  ```js
  var input = {message: 'hi!'};
  // `subject` is required if message does not equal `hi!`
  satpam.validate({subject: 'requiredIfNot:message:hi!'});
  ```

  For more complex example please see
  - [`requiredIfNot` examples](https://github.com/cermati/satpam/blob/master/test/validators/required-if-not.spec.js#L103)
  - [`noes` examples](https://github.com/sendyhalim/noes)
- `minimumAge:<age>:<dateFormat>`
- `taxId:$1` Currently only support indonesian tax id e.g. `taxId:id`

  Use object notation for defining this rule
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/member-of.spec.js#L5)
- `beginWith:$1`

  Use object notation for defining this rule
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/begin-with.spec.js#L5)
- `pattern:$1:$2`

  `$1` is the pattern, `$2` is the regex flags
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/pattern.spec.js#L6)
- `uuid:$1`

  `$1` is the version, available options v1, v3, v4, v5, all
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/uuid.spec.js#L6)
- `indonesiaIdCardNumberBirthDate:$1:$2`

  `$1` is the Birth Date's key, $2 is the date format used
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/indonesia-id-card-number-birth-date.spec.js#L6)
- `indonesiaIdCardNumberGender:$1:$2:$3`

  `$1` is the Gender's key, $2 is the value for male, $3 is the value for female
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/indonesia-id-card-number-gender.spec.js#L6)
- `indonesiaIdCardNumberProvince:$1`

  `$1` is the Province's Key
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/indonesia-id-card-number-province.spec.js#L6)
- `indonesiaIdCardNumberValidProvince`

  [examples](https://github.com/cermati/satpam/blob/master/test/validators/indonesia-id-card-number-valid-province.spec.js#L6)
- `indonesianName`

  [examples](https://github.com/cermati/satpam/blob/master/test/validators/indonesian-name.spec.js#L6)


## Complete Examples
To see complete example usage, please see the [unit tests](https://github.com/cermati/satpam/blob/master/test/validators)

## Custom Validation Rules
Add custom validation rule(s) globally. Note that
everytime you add a custom validation rule it will affect every `Satpam` instance(s) that
is created after the custom rules addition, but not the old instance(s).


```js
const satpam = require('satpam');

// oldValidator will not have `must-be-ironman` rule, because it's created
// before we add the custom validation.
const oldValidator = satpam.create();

// The global satpam validator will has updated validation rules.
// After this statement, we can do satpam.validate({name: ['must-be-ironman']}, ...);
satpam.addCustomValidation('must-be-ironman', val => val === 'ironman');
satpam.setValidationMessage('must-be-ironman', 'Not ironman D:');

// With parameters
satpam.addCustomValidation('range:$1:$2', (val, ruleObj) => {
  return val >= ruleObj.params[0] && val <= ruleObj.params[1];
});

// If validation fails it will set message to:
// "PropertyName must between 0 and 30"
satpam.setValidationMessage('range:$1:$2', '<%= propertyName %> must between <%= ruleParams[0] %> and <%= ruleParams[1] %>');

// newValidator will have `must-be-ironman` rule because it's created
// after we add the custom validation.
const newValidator = satpam.create();
```

## Optional Validation
Sometimes you want the validation to pass if any of the validation rule is satisfied,
we can do this by supplying the validation rules in an array.

```js
const rules = {
  // It will pass if document is passed and either a pdf or an image
  document: ['required', ['fileType:pdf', 'image']]
};
```


## Running Validation Based On Some Conditions
There's also a case when you only want to run a validation rule only if a specific condition is fulfilled.

```js
const shouldValidateZipCode = (ruleObj, inputObj) => {
  return inputObj.livesInJakarta;
};

const rules = {
  // Only require zip code if `livesInJakarta` is truthy
  zipCode: [
    {name: 'required', shouldValidate: shouldValidateZipCode}
  ]
};

satpam.validate(rules, {}); // {success: true}
satpam.validate(rules, {
  livesInJakarta: true
}); // Will fail
```


## Custom Validation Messages
You can override each validation rule's message

```js
satpam.setValidationMessage(
  'minLength:$1',
  '<%= propertyName %> must have length more than <%= ruleParams[0] %>'
);
```

You can also pass a `Function` instead of a `String`

```js
/**
 * @example
 * const satpam = require('satpam');
 *
 * const rules = {name: ['minLength:10']};
 * const input = {name: 'wubwub'};
 * satpam.validate(rules, input);
 *
 * expect(ruleObj.name).to.equal('minLength');
 * expect(ruleObj.fullName).to.equal('minLength:$1');
 * expect(ruleObj.params).to.deep.equal([10]);
 * expect(propertyName).to.equal('name');
 * expect(value).to.equal('wubwub');
 *
 * @param {Object} ruleObj
 * @param {String} ruleObj.name - The validation rule name
 *   e.g. `minLength:10` will have name minLength
 * @param {String} ruleObj.fullName - Validation rule fullname
 *   e.g. `minLength:10` will have fullName `minLength:$1`
 * @param {Array} ruleObj.params - The rule parameters
 *   e.g. `minlength:10` will have params `[10]`
 * @param {String} propertyName
 * @param {*} value
 */
const message = (ruleObj, propertyName, value) => {
  ...
};
satpam.setValidationMessage('minLength:$1', message);
```

## License
MIT

![Hi-Five](https://media.giphy.com/media/JhThbOq62vwn6/giphy.gif)

