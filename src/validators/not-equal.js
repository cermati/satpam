import complement from 'ramda/src/complement';
import equal from './equal';

const validate = complement(equal.validate);

const message = '<%= propertyName %> must not equal to <%= ruleParams[0] %>.';

export default {validate, message};
