import R from 'ramda';
import equal from './equal';

const validate = R.complement(equal.validate);

const message = '<%= propertyName %> must not equal to <%= ruleParams[0] %>.';

export default {validate, message};
