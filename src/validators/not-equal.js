import _ from 'lodash/fp';
import equal from './equal';

const validate = _.negate(equal.validate);

const message = '<%= propertyName %> must not equal to <%= ruleParams[0] %>.';

export default {validate, message};
