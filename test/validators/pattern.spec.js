import { expect } from 'chai';
import validator from '../../lib';

describe('regexp validator', () => {
  context('given null value', () => {
    const rules = {
      name: ['pattern:42:g']
    };
    const result = validator.validate(rules, {name: null});
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
    });
  });

  context('given undefined value', () => {
    const rules = {
      name: ['pattern:42:g']
    };
    const result = validator.validate(rules, {});
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
    });
  });

  context('given value that matches the pattern non digit', () => {
    const rules = {
      name: ['pattern:\\D:g']
    };
    const result = validator.validate(rules, {name: 'halo'});
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  context('given value that does not match the pattern non digit', () => {
    const rules = {
      name: ['pattern:\\D:g']
    };
    const result = validator.validate(rules, {name: '3'});
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });


    it('should have correct validation message', () => {
      expect(err.name['pattern:$1:$2']).to.equal('Name does not conform pattern \\D.');
    });
  });

  context('given value that matches the pattern "(alo){3}$"', () => {
    const rules = {
      name: ['pattern:(alo){3}$:g']
    };
    const result = validator.validate(rules, {name: 'haloaloalo'});
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  context('given value that does not match the pattern "(alo){3}$"', () => {
    const rules = {
      name: ['pattern:(alo){3}$:g']
    };
    const result = validator.validate(rules, {name: 'haloalo'});
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });

    it('should have correct validation message', () => {
      expect(err.name['pattern:$1:$2']).to.equal('Name does not conform pattern (alo){3}$.');
    });
  });
});
