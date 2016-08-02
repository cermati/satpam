import { expect } from 'chai';
import satpam from '../../lib';

describe('Validator.addCustomValidation()', () => {
  context('when instance validation rule is customized', () => {
    const validator = satpam.create();

    before('set validation rule', () => {
      validator.addCustomValidation('required', function (val) {
        return val === 'yo';
      });
    });

    it('should not pass with the customized required rule', () => {
      const rules = {fullName: ['required']};
      const result = validator.validate(rules, {fullName: 'ayo'});

      expect(result.success).to.be.false;
      expect(result.messages.fullName.required).to.equal('Full Name field is required.');
    });

    it('should pass with the customized required rule', () => {
      const rules = {fullName: ['required']};
      const result = satpam.validate(rules, {
        fullName: 'yo'
      });

      expect(result.success).to.be.true;
      expect(result.messages).to.not.have.property('fullName');
    });

    it('should not affect global validation rule', () => {
      const rules = {fullName: ['required']};
      const result = satpam.validate(rules, {fullName: 'hehe'});

      expect(result.success).to.be.true;
      expect(result.messages).to.not.have.property('fullName');
    });
  });

  context('when global validation rule is customized', () => {
    const oldValidator = satpam.create();

    before('add global validation rule', () => {
      satpam.addCustomValidation('wutwut', function (val) {
        return val === 'wut?';
      });

      satpam.setValidationMessage('wutwut', 'lukeskywalker');
    });

    it('should return correct validation result', () => {
      const ruleObj = {fullName: ['wutwut']};
      const result = satpam.validate(ruleObj, {fullName: 'wut?'});

      expect(result.success).to.be.true;
      expect(result.messages).to.not.have.property('fullName');
    });

    it('should affect the newly created validator instance', () => {
      const newValidator = satpam.create();
      const ruleObj = {fullName: ['wutwut']};
      const result = newValidator.validate(ruleObj, {fullName: 'wut?'});

      expect(result.success).to.be.true;
      expect(result.messages).to.not.have.property('fullName');
    });

    it('should not affect the old validator insance', () => {
      const ruleObj = {fullName: ['wutwut']};
      const validateFn = oldValidator.validate.bind(
        oldValidator,
        ruleObj,
        {fullName: 'hiks'}
      );

      expect(validateFn).to.throw(Error);
    });
  });
});

