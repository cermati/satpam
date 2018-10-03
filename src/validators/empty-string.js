import equals from 'ramda/src/equals';

const validate = equals('');

const message = '<%= propertyName %> field must be an empty string.';

export default {validate, message};

