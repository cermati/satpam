import R from 'ramda';

const validate = R.equals('');

const message = '<%= propertyName %> field must be an empty string.';

export default {validate, message};

