import { expect } from 'chai';
import validator from '../../lib';

describe('Indonesian name validator', () => {
  const rules = {
    name: ['indonesianName']
  };

  context('first name', () => {
    it('should success', () => {
      const result = validator.validate(rules, {name: 'Bogged'});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  context('name with spaces', () => {
    it('should success', () => {
      const result = validator.validate(rules, {name: 'Bogged kuadrat'});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  context('name with valid special characters', () => {
    it('should success', () => {
      const result = validator.validate(rules, {name: 'Bog-ged K.'});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  context('name with invalid special characters', () => {
    it('should fail', () => {
      const result = validator.validate(rules, {name: 'Bog-ged K.*'});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });
  });

  context('name with number', () => {
    it('should fail', () => {
      const result = validator.validate(rules, {name: 'Bogged 2'});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });
  });
});

