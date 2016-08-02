import R from 'ramda';
import { expect } from 'chai';
import satpam from '../../lib';
import required from '../../lib/validators/required';

describe('Validator.getValidationMessage()', () => {
  context('when instance validation message is customized', () => {
    context('and the validation messsage is a string literal', () => {
      const validator = satpam.create();

      before('set validation message', () => {
        validator.setValidationMessage('required', 'bulbazaurz');
      });

      it('should return correct validation message', () => {
        const ruleObj = {
          fullName: 'required'
        };

        const message = validator.getValidationMessage(ruleObj, 'name', 'wut');
        expect(message).to.equal('bulbazaurz');
      });

      it('should not affect global validation message', () => {
        const rules = {fullName: ['required']};
        const result = satpam.validate(rules, {});

        expect(result.messages.fullName.required).to.equal('Full Name field is required.');
      });
    });

    context('and the validation messsage is a function literal', () => {
      const validator = satpam.create();

      before('set validation message', () => {
        validator.setValidationMessage('required', R.always('it is required!'));
      });

      it('should return correct validation message', () => {
        const ruleObj = {
          fullName: 'required'
        };

        const message = validator.getValidationMessage(ruleObj, 'name', 'wut');

        expect(message).to.equal('it is required!');
      });

      it('should not affect global validation message', () => {
        const rules = {fullName: ['required']};
        const result = satpam.validate(rules, {});

        expect(result.messages.fullName.required).to.equal('Full Name field is required.');
      });
    });
  });

  context('when global validation message is customized', () => {
    const validator = satpam.create();

    before('set global validation message', () => {
      satpam.setValidationMessage('required', 'huuu!');
    });

    after('reset validation message', () => {
      satpam.setValidationMessage('required', required.message);
    });

    it('should return correct validation message', () => {
      const ruleObj = {fullName: ['required']};
      const result = satpam.validate(ruleObj, {});

      expect(result.messages.fullName.required).to.equal('huuu!');
    });

    it('should affect the newly created validator instance', () => {
      const newValidator = satpam.create();
      const ruleObj = {fullName: 'required'};

      const message = newValidator.getValidationMessage(ruleObj, 'fullName', 'wut');
      expect(message).to.equal('huuu!');
    });

    it('should not affect the old validator insance', () => {
      const rules = {fullName: ['required']};
      const result = validator.validate(rules, {});

      expect(result.messages.fullName.required).to.equal('Full Name field is required.');
    });
  });
});

