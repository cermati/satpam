import { expect } from 'chai';
import validator from '../../lib';

describe('regexp validator', () => {
  context('given value that matches the pattern non digit', () => {
    const rules = {
      name: ['regex:\\D:g']
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
      name: ['regex:\\D:g']
    };
    const result = validator.validate(rules, {name: '3'});
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });


    it('should have correct validation message', () => {
      expect(err.name['regex:$1:$2']).to.equal('Name does not conform pattern \\D.');
    });
  });

  context('given value that matches the pattern "(alo){3}$"', () => {
    const rules = {
      name: ['regex:(alo){3}$:g']
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
      name: ['regex:(alo){3}$:g']
    };
    const result = validator.validate(rules, {name: 'haloalo'});
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });

    it('should have correct validation message', () => {
      expect(err.name['regex:$1:$2']).to.equal('Name does not conform pattern (alo){3}$.');
    });
  });
});
