import equals from 'ramda/src/equals';

const fullName = 'emptyString';

const validate = equals('');

const message = '<%= propertyName %> field must be an empty string.';

export default { fullName, validate, message };

