import { expect } from 'chai';
import validator from '../../lib';

describe('MinLength validator', () => {
  const ruleWithParam = {
    name: ['minLength:5']
  };

  const acceptedInputs = [
    'abcde',
    'abcd ',
    'wololo',
    'pneumonoultramicroscopicsilicovolcanoconiosis'
  ];

  const rejectedInputs = [
    '',
    'asd',
    'tele',
    null,
    undefined
  ];

  it('should success', () => {
    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(ruleWithParam, {name: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  it('should fail', () => {
    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(ruleWithParam, {name: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
      expect(err.name['minLength:$1']).to.equal('Name must contain at least 5 character(s).');
    });
  });
});
