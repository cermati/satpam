import { expect } from 'chai';
import validator from '../../lib';
import requiredIf from '../../lib/validators/required-if';

describe('Required if validator', () => {
  context('with validator wrapper', () => {
    context('when given normal parameters', () => {
      const simpleRules = {
        address: ['requiredIf:hasHome:Yes']
      };

      it('should success if hasHome equals to Yes', () => {
        const result = validator.validate(simpleRules, {
          hasHome: 'Yes',
          address: 'somewhere over the rainbow'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('name');
      });

      it('should success if hasHome is undefined', () => {
        const result = validator.validate(simpleRules, {});
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('name');
      });

      it('should fail', () => {
        const input = {hasHome: 'Yes'};
        const result = validator.validate(simpleRules, input);
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('address');
        expect(err.address['requiredIf:$1:$2']).to.equal('Address field is required.');
      });
    });

    context('when given Or parameter', () => {
      const or = new requiredIf.Or({
        hasHome: 'yes',
        hasApartment: 'yo'
      });

      const rules = {
        address: [{
          fullName: 'requiredIf:$1:$2',
          params: [or]
        }]
      };

      it('should success with 1 satisfied parameter', () => {
        const result = validator.validate(rules, {
          hasHome: 'yes',
          address: 'wut'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('address');
      });

      it('should success when all parameters are not satisfied', () => {
        const result = validator.validate(rules, {});
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('address');
      });
    });
  });
});
