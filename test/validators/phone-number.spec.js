import { expect } from 'chai';
import validator from '../../lib';

describe('Phone number validator', () => {
  const rule = {
    phone: ['phoneNumber']
  };

  context('with empty phone number', () => {
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

  context('with valid phone number that starts with 021', () => {
    it('should success', () => {
      const result = validator.validate(rule, {
        phone: '+62219837121'
      });

      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid phone number that starts with +6221', () => {
    it('should success', () => {
      const result = validator.validate(rule, {
        phone: '+62219837121'
      });

      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with invalid phone number that starts with 221', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '2219123123'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });

  context('with invalid mobile phone number that starts with 812', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '8123456789'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });

  context('with invalid mobile phone number that have 16 numbers after 0', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '08123456789123456'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });

  context('with invalid mobile phone number that have length 5', () => {
    it('should fail', () => {
      const result = validator.validate(rule, {
        phone: '02185'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });
});
