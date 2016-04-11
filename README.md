# Satpam
-----
Satpam is a wrapper for some nodejs validator libraries, I made `Satpam` so it's easy to create
custom validator with parameters and custom validation messages.

[![Build Status](https://travis-ci.org/sendyhalim/satpam.svg)](https://travis-ci.org/sendyhalim/satpam)
[![npm version](https://badge.fury.io/js/satpam.svg)](https://badge.fury.io/js/satpam)

## Installation
```
npm install satpam --save
```

## Quick Usage
```js
import satpam from 'satpam';

const rules = {
  name: ['required']
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

  // or get all messages in array form
  result.messages.messageArray[0] = 'OfficeEmail must be email';
  result.messages.messageArray[1] = 'Phone must be numeric';
}
```

## Satpam instance
Satpam has `create` method to create new validator instance.

- Each instance will have cloned validation rules and messages, so it's safe to add or override validation rule without affecting other validator instances or the global satpam validator.
- The cloned validation rules and messages will be based on the current state of the global satpam validator. See [Custom Rules](#custom-rules)



```
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
- `maxLength:<length>`
- `minLength:<length>`
- `maxValue:<max value>`
- `minValue:<min value>`
- `memberOf:$1`
- `equal:$1`
- `notEqual:$1`
- `requiredIf:$1:$2`

  ```
  var input = {message: 'hi!'};
  // `subject` is required if message equals `hi!`
  satpam.validate({subject: 'requiredIf:message:hi!'});
  ```
- `taxId:$1` Currently only support indonesian tax id e.g. `taxId:id`

  Use object notation for defining this rule
  [examples](https://github.com/sendyhalim/satpam/blob/master/test/member-of.spec.js#L10)
- `beginWith:$1`

  Use object notation for defining this rule
  [examples](https://github.com/sendyhalim/satpam/blob/master/test/begin-with.spec.js#L10)
- `regex:$1:$2`

  `$1` is the pattern, `$2` is the regex flags
  [examples](https://github.com/sendyhalim/satpam/blob/master/test/regex.spec.js#L9)

## Custom rules
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

## TODOs
- Better documentation.
- Add more validation rules.
- Validate file types.

## More examples
[Here](https://github.com/sendyhalim/satpam/blob/master/test)

![Read the source Luke](http://blog.codinghorror.com/content/images/uploads/2012/04/6a0120a85dcdae970b016765373659970b-800wi.jpg)

## License
MIT

![Hi-Five](https://media.giphy.com/media/JhThbOq62vwn6/giphy.gif)
