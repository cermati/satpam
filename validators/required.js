exports = module.exports = {
  validator: function(val) {
    return !(val === undefined || val === null || val === '');
  },
  message: '<%= propertyName %> is required'
};
