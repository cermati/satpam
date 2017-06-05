import {expect} from 'chai';
import validator from '../../lib';

describe ('Between validator', () => {
  const rules = {
    price: ['between:25:50']
  };

  context('given a number between 25 and 50', () => {
    const price = 30;

    const result = validator.validate(rules, {
      price: price
    });

    it('should success', () => {
      expect(result.success).to.equal(true);
    });

    it('should not set validation message', () => {
      expect(result.messages).to.not.have.property('price');
    });
  });

  context('given a number in the boundary (25)', () => {
    const price = 25;

    const result = validator.validate(rules, {
      price: price
    });

    it('should fail', () => {
      expect(result.success).to.equal(false);
    });

    it('should set validation message', () => {
      expect(result.messages.price).to.have.property('between:$1:$2')
        .that.equals('Price must be greater than 25 and less than 50.');
    });
  });
});
