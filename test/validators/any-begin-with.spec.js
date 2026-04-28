import { expect } from 'chai';
import validator from '../../lib';

describe('any-beginWith validator', () => {
  const objectRules = {
    items: [
      {name: 'any-beginWith', params: [['Apple iPhone 14', 'Charger']]}
    ]
  };

  it('should success for single item', () => {
    const acceptedInputs = [
      'Apple iPhone 14 128GB',
      'Apple iPhone 14 Pro 512GB',
      'Charger Apple',
    ];

    acceptedInputs.forEach(acceptedInput => {
      const result = validator.validate(objectRules, {items: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('items');
    });
  });

  it('should success for array item', () => {
    const acceptedInputs = [
      ['Apple iPhone 14 128GB', 'Charger UGREEN'],
      ['Apple iPhone 14 128GB', 'Charger', 'Case', 'Tempered Glass']
    ];

    acceptedInputs.forEach(acceptedInput => {
      const result = validator.validate(objectRules, {items: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('items');
    });
  });

  it('should success for lowercase and uppercase items', () => {
    const acceptedInputs = [
      'charger',
      'APPLE IPHONE 14',
      ['apple iphone 14 128gb', 'charger'],
      ['APPLE IPHONE 14 128GB', 'CHARGER', 'CASE']
    ];

    acceptedInputs.forEach(acceptedInput => {
      const result = validator.validate(objectRules, {items: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('items');
    });
  });

  it('should fail for empty input', () => {
    const rejectedInputs = [
      '',
      [],
      null,
      undefined
    ];

    rejectedInputs.forEach(rejectedInput => {
      const result = validator.validate(objectRules, {items: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('items');
      expect(err.items['any-beginWith:$1']).to.equal('Any of Items must begin with any of Apple iPhone 14,Charger.');
    });
  });

  it('should fail for none of the item start with prefix in rules', () => {
    const rejectedInputs = [
      'iphone 14',
      ['iphone 14', 'case'],
    ];

    rejectedInputs.forEach(rejectedInput => {
      const result = validator.validate(objectRules, {items: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('items');
      expect(err.items['any-beginWith:$1']).to.equal('Any of Items must begin with any of Apple iPhone 14,Charger.');
    });
  });

  it('should fail for non string or non array of strings', () => {
    const rejectedInputs = [
      ['doge', 'cat', {wild: 'object'}],
      ['dog', 'catherine', 123],
      {wild: 'object'}
    ];

    rejectedInputs.forEach(rejectedInput => {
      const result = validator.validate(objectRules, {items: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('items');
      expect(err.items['any-beginWith:$1']).to.equal('Any of Items must begin with any of Apple iPhone 14,Charger.');
    });
  });
});
