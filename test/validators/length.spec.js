import { expect } from 'chai';
import validator from '../../lib';

describe('Length validator', () => {
  const rules = {
    name: ['length:5']
  };

  context('when the given input is a number', () => {
    context('and it does not have length of 5', () => {
      it('should not pass the validation', () => {
        const result = validator.validate(rules, {name: 1234});
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('name');
        expect(err.name['length:$1']).to.equal('Name must have length of 5 character(s).');
      });
    });

    context('and it has length of 5', () => {
      it('should pass the validation', () => {
        const result = validator.validate(rules, {name: 12345});
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('name');
      });
    });
  });

  context('when the given input is a string', () => {
    context('and it does not have length of 5', () => {
      it('should not pass the validation', () => {
        const result = validator.validate(rules, {name: 'heyh'});
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('name');
        expect(err.name['length:$1']).to.equal('Name must have length of 5 character(s).');
      });
    });

    context('and it has length of 5', () => {
      it('should pass the validation', () => {
        const result = validator.validate(rules, {name: 'yowut'});
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('name');
      });
    });
  });
});
