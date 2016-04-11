const validate = val => {
  return !(val === undefined || val === null || val === '');
};

const message = '<%= propertyName %> field is required.';

export default {validate, message};
