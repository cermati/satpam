import { expect } from 'chai';
import validator from '../../lib';

describe('international phone number validator', () => {
  const rule = {
    phone: ['internationalPhoneNumber']
  };

  context('with empty international phone number', () => {
    it('should success', () => {
      const result = validator.validate(rule, { phone: '' });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with international phone number starts with 60', () => {
    it('should success', () => {
      const result = validator.validate(rule, { phone: '60112345678' });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with international phone number starts with +65', () => {
    it('should success', () => {
      const result = validator.validate(rule, { phone: '+658123456' });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with international phone number starts with 680', () => {
    it('should success', () => {
      const result = validator.validate(rule, { phone: '68012345678' });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid indonesia national phone number starts with 08', () => {
    it('should fail', () => {
      const result = validator.validate(rule, { phone: '08123456789' });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('phone');
    });
  });

  context('with valid indonesia international phone number starts with +62', () => {
    it('should success', () => {
      const result = validator.validate(rule, { phone: '+628123456789' });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with invalid international phone number starts with 990', () => {
    it('should fail', () => {
      const result = validator.validate(rule, { phone: '990658123456' });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('phone');
    });
  });

  context('with invalid international phone number starts with +671', () => {
    it('should fail', () => {
      const result = validator.validate(rule, { phone: '+671658123456' });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('phone');
    });
  });
});
