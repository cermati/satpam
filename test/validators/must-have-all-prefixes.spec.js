import { expect } from 'chai';
import validator from '../../lib';

describe('mustHaveAllPrefixes validator', () => {
  const objectRules = {
    item: [
      {
        name: 'mustHaveAllPrefixes', params: [['iphone', 'macbook']]
      }
    ]
  };

  it('should success if inputs have the required items', () => {
    const acceptedInputs = [
      ['iphone 17', 'macbook neo'],
      ['iphone 17', 'charger', 'macbook neo'],
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(objectRules, {item: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('item');
    });
  });

  it('should fail if inputs only have some of the required items', () => {
    const rejectedInputs = [
      ['iphone 17', 'charger'],
      ['iphone 17', 'charger', 'case'],
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {item: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('item');
      expect(err.item['mustHaveAllPrefixes:$1']).to.equal('Item must have all prefixes of iphone,macbook.');
    });
  });

  it('should fail if inputs have none of the required items', () => {
    const rejectedInputs = [
      'charger',
      ['charger', 'case'],
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {item: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('item');
      expect(err.item['mustHaveAllPrefixes:$1']).to.equal('Item must have all prefixes of iphone,macbook.');
    });
  });

  it('should fail if an empty array is passed', () => {
    const acceptedInputs = [];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(objectRules, {item: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('item');
      expect(err.item['mustHaveAllPrefixes:$1']).to.equal('Item must have all prefixes of iphone,macbook.');
    })
  })

  it('should fail if an array with items less than rule is passed', () => {
    const acceptedInputs = ['iphone 17'];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(objectRules, {item: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('item');
      expect(err.item['mustHaveAllPrefixes:$1']).to.equal('Item must have all prefixes of iphone,macbook.');
    })
  })
});
