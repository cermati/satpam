import { expect } from 'chai';
import validator from '../../lib';

describe('not-MemberOf validator', () => {
  const objectRules = {
    pet: [
      {
        name: 'not-memberOf', params: [['salamander', 'catfish', 'komodo']]
      }
    ]
  };

  it('should success for single item not in the list', () => {
    const acceptedInputs = [
      'dog',
      'cat',
      'fish'
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(objectRules, {pet: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pet');
    });
  });

  it('should success for array item', () => {
    const acceptedInputs = [
      [],
      ['fish'],
      ['dog', 'cat']
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(objectRules, {pet: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pet');
    });
  });

  it('should fail for single item in the list', () => {
    const rejectedInputs = [
      'catfish'
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['not-memberOf:$1']).to.equal('Pet must not be one of salamander,catfish,komodo.');
    });
  });

  it('should fail for array item which contains item in the list', () => {
    const rejectedInputs = [
      ['dog', 'cat', 'fish', 'catfish'],
      ['salamander']
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['not-memberOf:$1']).to.equal('Pet must not be one of salamander,catfish,komodo.');
    });
  });

  it('should fail for non string or non array of strings', () => {
    const rejectedInputs = [
      ['dog', 'cat', {wild: 'object'}],
      ['dog', 'cat', 123],
      {wild: 'object'}
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['not-memberOf:$1']).to.equal('Pet must not be one of salamander,catfish,komodo.');
    });
  });
});
