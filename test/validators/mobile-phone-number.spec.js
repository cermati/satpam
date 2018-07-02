import { expect } from 'chai';
import validator from '../../lib';

describe('mobile phone number validator', () => {
  const rule = {
    phone: ['mobilePhoneNumber']
  };

  context('with empty mobile phone number', () => {
    it('should success', () => {
      const result = validator.validate(rule, {});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid mobile phone number that starts with 08', () => {
    it('should success', () => {
      const result = validator.validate(rule, {
        phone: '08123456789'
      });

      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid mobile phone number that starts with +628', () => {
    it('should success', () => {
      const result = validator.validate(rule, {
        phone: '+628123456789'
      });

      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with invalid mobile phone number that starts with 812', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '8123456789'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.mobilePhoneNumber)
        .to.equal('Phone field is not a valid mobile phone number.');
    });
  });

  context('with invalid mobile phone number that have 13 numbers after +628', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '+6281234567891234'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.mobilePhoneNumber)
        .to.equal('Phone field is not a valid mobile phone number.');
    });
  });

  context('with invalid mobile phone number that 5 numbers after 628', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '62812345'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.mobilePhoneNumber)
        .to.equal('Phone field is not a valid mobile phone number.');
    });
  });

  context('with invalid mobile phone number prefix', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '62824123456'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.mobilePhoneNumber)
        .to.equal('Phone field is not a valid mobile phone number.');
    });
  });
});
