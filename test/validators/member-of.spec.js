import { expect } from 'chai';
import validator from '../../lib';

describe('MemberOf validator', () => {
  const objectRules = {
    pet: [
      {
        name: 'memberOf', params: [['dog', 'cat', 'fish']]
      }
    ]
  };

  it('should success for single item', () => {
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

  it('should fail for single item not in the list', () => {
    const rejectedInputs = [
      'shark'
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });

  it('should fail for array item which contains item not in the list', () => {
    const rejectedInputs = [
      ['dog', 'cat', 'fish', 'bear'],
      ['shark']
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
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
      expect(err.pet['memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });
});
