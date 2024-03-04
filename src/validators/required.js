const fullName = 'required';

const validate = val => {
  return !(val === undefined || val === null || val === '');
};

const message = '<%= propertyName %> field is required.';

export default { fullName, validate, message };
