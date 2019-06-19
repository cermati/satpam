import { expect } from 'chai';
import validator from '../../lib';

describe('Address validator', () => {
  const rules = {
    address: ['address']
  };

  context('normal address', () => {
    it('should success', () => {
      const result = validator.validate(rules, {address: 'Jl. Tomang Raya No.38, RT.5/RW.1, Jati Pulo, Palmerah, West Jakarta City, Jakarta 11430'});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });
  });

  context('address with line separator', () => {
    it('should fail', () => {
      const result = validator.validate(rules, {address: 'Jl. Tomang Raya No.38, RT.5/RW.1, Jati Pulo, Palmerah, \n West Jakarta City, Jakarta 11430'});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('address');
    });
  });

  context('address only consist of numbers', () => {
    it('should fail', () => {
      const result = validator.validate(rules, {address: '123123'});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('address');
    });
  });

  context('address only consist of special characters', () => {
    it('should fail', () => {
      const result = validator.validate(rules, {address: '*&()'});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('address');
    });
  });

  context('address only consist of white characters', () => {
    it('should fail', () => {
      const result = validator.validate(rules, {address: '   '});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('address');
    });
  });

  context('address only consist of numbers, special and whitespace characters', () => {
    it('should fail', () => {
      const result = validator.validate(rules, {address: '  23  & '});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('address');
    });
  });
});
