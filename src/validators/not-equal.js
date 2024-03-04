import complement from 'ramda/src/complement';
import equal from './equal';

const fullName = 'not-equal:$1';

const validate = complement(equal.validate);

const message = '<%= propertyName %> must not equal to <%= ruleParams[0] %>.';

export default { fullName, validate, message };
