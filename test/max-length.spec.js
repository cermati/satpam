import { expect } from 'chai';
import validator from '../lib';

describe('MaxLength validator', () => {
  const ruleWithParam = {
    name: ['maxLength:5']
  };

  const acceptedInputs = [
    'tele',
    'phone',
    '',
    ' woi ',
    '4l@y.',
    12345,
    123,
    0,
    -1234
  ];

  const rejectedInputs = [
    '      ',
    'asdasd',
    'pneumonoultramicroscopicsilicovolcanoconiosis',
    123456,
    -12345,
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
      expect(err.name['maxLength:$1']).to.equal('Name must contain at most 5 character(s).');
    });
  });
});
