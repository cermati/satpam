const R = require('ramda');
const validate = val => typeof(val) === 'boolean';

const message = '<%= propertyName %> must be a boolean.';

export default {validate, message};
