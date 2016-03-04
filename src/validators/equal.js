module.exports = {
  validator: (val, ruleObj) => val === ruleObj.params[0],
  message: '<%= propertyName %> must equal to <%= ruleParams[0] %>.'
};
