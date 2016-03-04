import _ from 'lodash/fp';
import equal from './equal';

module.exports = {
  validator: _.negate(equal.validator),
  message: '<%= propertyName %> must not equal to <%= ruleParams[0] %>.'
};
