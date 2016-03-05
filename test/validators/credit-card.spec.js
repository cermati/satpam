import { expect } from 'chai';
import validator from '../../lib';

describe('Credit card validator', () => {
  const validCardNumber = '4111111111111111';
  const rules = {
    cardNumber: ['creditCard']
  };

  it('should success', () => {
    const result = validator.validate(rules, {cardNumber: validCardNumber});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('cardNumber');
  });

  it('should fail', () => {
    const result = validator.validate(rules, {cardNumber: '4111111111111112'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('cardNumber');
    expect(err.cardNumber.creditCard).to.equal('Card Number is not a valid credit card number.');
  });
});
