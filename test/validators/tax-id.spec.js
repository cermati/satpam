import { expect } from 'chai';
import validator from '../../lib';

describe('Tax ID validator', () => {
  describe('Indonesian Tax Id', () => {
    const rules = {
      myTaxIdNumber: ['taxId:id']
    };

    context('given tax id number', () => {
      context('with invalid length', () => {
        const result = validator.validate(rules, {
          myTaxIdNumber: '1232131'
        });
        const messages = result.messages;

        it('should fail', () => {
          expect(result.success).to.equal(false);
          expect(messages).to.have.property('myTaxIdNumber');
          expect(messages.myTaxIdNumber['taxId:$1']).to.equal('My Tax Id Number is not a valid tax identification number.');
        });
      });

      context('with valid length but with non digit character', () => {
        const result = validator.validate(rules, {
          myTaxIdNumber: '12345678A012345'
        });
        const messages = result.messages;

        it('should fail', () => {
          expect(result.success).to.equal(false);
          expect(messages).to.have.property('myTaxIdNumber');
          expect(messages.myTaxIdNumber['taxId:$1']).to.equal('My Tax Id Number is not a valid tax identification number.');
        });
      });

      context('with invalid tax id number', () => {
        const result = validator.validate(rules, {
          myTaxIdNumber: '123456789012345'
        });
        const messages = result.messages;

        it('should fail', () => {
          expect(result.success).to.equal(false);
          expect(messages).to.have.property('myTaxIdNumber');
          expect(messages.myTaxIdNumber['taxId:$1']).to.equal('My Tax Id Number is not a valid tax identification number.');
        });
      });

      context('with valid tax id number', () => {
        const result = validator.validate(rules, {
          myTaxIdNumber: '012345674123000'
        });
        const messages = result.messages;

        it('should success', () => {
          expect(result.success).to.equal(true);
          expect(messages).to.not.have.property('myTaxIdNumber');
        });
      });
    });
  });
});
