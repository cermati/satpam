# Satpam
-----
Satpam is a wrapper for some nodejs validator libraries, I made `Satpam` so it's easy to create
custom validator with parameters and custom validation messages.

[![Build Status](https://travis-ci.org/cermati/satpam.svg)](https://travis-ci.org/cermati/satpam)
[![npm version](https://badge.fury.io/js/satpam.svg)](https://badge.fury.io/js/satpam)


## Installation
```
npm install satpam --save
```


## Quick Usage
```js
import satpam from 'satpam';

const rules = {
  name: ['required'],
  officeEmail: ['email'],
  phone: ['required', 'numeric']
};

const input = {
  name: 'Sendy',
  title: 'Lord',
  officeEmail: 'invalid email',
  phone: 'hi there123'
};

const result = satpam.validate(rules, input);

if (result.success === true) {
  // valid
} else {
  // invalid
  result.messages.officeEmail.email === 'OfficeEmail must be email';
  result.messages.phone.number === 'Phone must be numeric';
}
```


## Satpam instance
Satpam has `create` method to create new validator instance.

- Each instance will have cloned validation rules and messages, so it's safe to add or override validation rule without affecting other validator instances or the global satpam validator.
- The cloned validation rules and messages will be based on the current state of the global satpam validator. See [Custom Rules](#custom-rules)


```js
import satpam from 'satpam';

const validatorOne = satpam.create();
const validatorTwo = satpam.create();
```


## Available Rules
- `required`
- `numeric`
- `email`
- `image`
- `alpha`
- `alphanumeric`
- `boolean`
- `date`
- `dateFormat:<format, e.g. DD-MM-YYYY>`
- `dateAfter:<the date input format, e.g. DD-MM-YYYY>:<date after e.g. 'now' or 20-1-2015>:<offset>:<unit of time e.g. 'days'>`
- `dateBefore:<the date input format, e.g. DD-MM-YYYY>:<date after e.g. 'now' or 20-1-2015>:<offset>:<unit of time e.g. 'days'>`
- `url`
- `string`
- `nonBlank`
- `creditCard`
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
- `notEqual:$1`
- `requiredIf:<fieldName>:<value>`
  ```js
  var input = {message: 'hi!'};
  // `subject` is required if message equals `hi!`
  satpam.validate({subject: 'requiredIf:message:hi!'});
  ```

  For more complex example please see
  - [`requiredIf` examples](https://github.com/cermati/satpam/blob/master/test/validators/required-if.spec.js#L147)
  - [`noes` examples](https://github.com/sendyhalim/noes)

- `minimumAge:<age>:<dateFormat>`
- `taxId:$1` Currently only support indonesian tax id e.g. `taxId:id`

  Use object notation for defining this rule
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/member-of.spec.js#L5)
- `beginWith:$1`

  Use object notation for defining this rule
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/begin-with.spec.js#L5)
- `regex:$1:$2`

  `$1` is the pattern, `$2` is the regex flags
  [examples](https://github.com/cermati/satpam/blob/master/test/validators/regex.spec.js#L6)



## Complete Examples
[Complete Examples](https://github.com/cermati/satpam/blob/master/test/validators)

## Custom Validation Rules
Add custom rules globally, it will affect every `Validator` instance(s) that
is created after the custom rules addition, but not the old instance(s).


```js
import satpam from 'satpam';

// oldValidator will not have `must-be-ironman` rule, because it's created
// before we add the custom validation.
const oldValidator = satpam.create();

// The global satpam validator will always the most updated validation rules.
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

## Optional validation rules

Sometimes you want the validation to pass if any of the validation rules is satisfied, to do this,
you need to wrap the validation rules in an array.

```js
const rules = {
  // It will pass if document is passed and either a pdf or an image
  document: ['required', ['fileType:pdf', 'image']]
};
```


## Custom Validation Messages
Setting validation messages is easy:

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
 * import satpam from 'satpam';
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
 * @param ruleObj
 * @param ruleObj.name - The validation rule name
 *   e.g. `minLength:10` will have name minLength
 * @param ruleObj.fullName - Validation rule fullname
 *   e.g. `minLength:10` will have fullName `minLength:$1`
 * @param ruleObj.params - The rule parameters
 *   e.g. `minlength:10` will have params `[10]`
 * @param propertyName
 * @param value
 */
const message = (ruleObj, propertyName, value) => {
  ...
};
satpam.setValidationMessage('minLength:$1', message);
```


## TODOs
- Better documentation.
- Add more validation rules.
- Validate file types.


## License
MIT

![Hi-Five](https://media.giphy.com/media/JhThbOq62vwn6/giphy.gif)
