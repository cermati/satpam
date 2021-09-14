import { expect } from 'chai';
import validator from '../../lib';

describe('Some MemberOf validator', () => {
  const objectRules = {
    pet: [
      {
        name: 'some-memberOf', params: [['dog', 'cat', 'fish']]
      }
    ]
  };

  it('should success for one item in the list', () => {
    const rejectedInputs = [
      'dog',
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});

      expect(result.success).to.equal(true);
    });
  });

  it('should success for array item which at least there is one item in the list', () => {
    const rejectedInputs = [
      ['cat'],
      ['dog', 'fish'],
      ['dog', 'fish', 'lion'],
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});

      expect(result.success).to.equal(true);
    });
  });

  it('should fail for empty array', () => {
    const rejectedInputs = [
      [],
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['some-memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });

  it('should fail for single item not in the list', () => {
    const rejectedInputs = [
      'bear',
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['some-memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });

  it('should fail for array item which all items are not in the list', () => {
    const rejectedInputs = [
      ['lion', 'bear'],
      ['shark']
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['some-memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });

  it('should fail for non string or non array of strings', () => {
    const rejectedInputs = [
      ['bear', 'lion', {wild: 'object'}],
      ['bear', 'lion', 123],
      {wild: 'object'}
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['some-memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });
});
