module.exports = {
  validator: val => !(val === undefined || val === null || val === ''),
  message: '<%= propertyName %> field is required.'
};
