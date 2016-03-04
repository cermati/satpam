import { expect } from 'chai';
import validator from '../lib';

describe('BeginWith validator', () => {
  const objectRules = {
    pet: [
      {name: 'beginWith', params: [['dog', 'cat', 'fish']]}
    ]
  };

  it('should success for single item', () => {
    const acceptedInputs = [
      'dog',
      'doge',
      'dog kintamani',
      'dog shiba inu',
      'cat woman',
      'fish erman'
    ];

    acceptedInputs.forEach(acceptedInput => {
      const result = validator.validate(objectRules, {pet: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pet');
    });
  });

  it('should success for array item', () => {
    const acceptedInputs = [
      [],
      ['dog', 'catherine'],
      ['dog', 'doge', 'dog kintamani', 'dog shiba inu', 'cat woman', 'fish arowana']
    ];

    acceptedInputs.forEach(acceptedInput => {
      const result = validator.validate(objectRules, {pet: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pet');
    });
  });

  it('should fail for single item not beginning with string in list', () => {
    const rejectedInputs = [
      '',
      'd',
      'do',
      'dug',
      'dug up',
      'cow',
      'fisx',
      null,
      undefined
    ];

    rejectedInputs.forEach(rejectedInput => {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['beginWith:$1']).to.equal('Pet must begin with one of dog,cat,fish.');
    });
  });

  it('should fail for array item which contains item not beginning with the string in list', () => {
    const rejectedInputs = [
      ['doge', 'dug'],
      ['dog kintamani', 'd'],
      ['dog kintamani', 'do']
    ];

    rejectedInputs.forEach(rejectedInput => {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['beginWith:$1']).to.equal('Pet must begin with one of dog,cat,fish.');
    });
  });

  it('should fail for non string or non array of strings', () => {
    const rejectedInputs = [
      ['doge', 'cat', {wild: 'object'}],
      ['dog', 'catherine', 123],
      {wild: 'object'}
    ];

    rejectedInputs.forEach(rejectedInput => {
      const result = validator.validate(objectRules, {pet: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['beginWith:$1']).to.equal('Pet must begin with one of dog,cat,fish.');
    });
  });
});
