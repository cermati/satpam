import { expect } from 'chai';
import validator from '../../lib';

describe('NonBlank validator', () => {
  const rules = {
    name: ['nonBlank']
  };

  const acceptedInputs = [
    'kardus',
    '  bar',
    'vector  ',
    '   a  b  ',
    'newline\n',
    ' \n wild \t \n',
    1214,
    {iAm: 'not simple string'}
  ];

  const rejectedInputs = [
    '',
    '    ',
    ' \n \n \t',
    null,
    undefined
  ];

  it('should success', () => {
    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(rules, {name: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  it('should fail', () => {
    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(rules, {name: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
      expect(err.name.nonBlank).to.equal('Name field must not be completely consists of white spaces.');
    });
  });
});
