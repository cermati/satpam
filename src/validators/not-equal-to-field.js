import complement from 'ramda/src/complement';
import equalToField from './not-equal-to-field';

const validate = complement(equalToField.validate);

const message = '<%= propertyName %> must not equal to <%= inputObj[ruleParams[0]] %>.';

export default {validate, message};
