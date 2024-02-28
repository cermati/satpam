import complement from 'ramda/src/complement';
import equalToField from './equal-to-field';

const fullName = 'not-equal-to-field:$1';

const validate = complement(equalToField.validate);

const message = '<%= propertyName %> must not equal to <%= inputObj[ruleParams[0]] %>.';

export default { fullName, validate, message };
