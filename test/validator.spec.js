import R from 'ramda';
import { expect } from 'chai';
import satpam from '../lib';

describe('Validator', () => {
  describe('.createRuleObject', () => {
    const validator = satpam.create();

    context('when the given rule is an object', () => {
      context('and it has no rule parameters', () => {
        it('should create valid ruleObj', () => {
          const ruleObj = validator._createRuleObject({
            name: 'wut'
          });

          expect(ruleObj).to.deep.equal({
            name: 'wut',
            fullName: 'wut',
            params: []
          });
        });
      });

      context('and it has one rule parameter', () => {
        it('should create valid ruleObj', () => {
          const ruleObj = validator._createRuleObject({
            name: 'this',
            params: ['is smelll']
          });

          expect(ruleObj).to.deep.equal({
            name: 'this',
            fullName: 'this:$1',
            params: ['is smelll']
          });
        });
      });

      context('and it has two rule parameters', () => {
        it('should create valid ruleObj', () => {
          const ruleObj = validator._createRuleObject({
            name: 'woosah',
            params: ['rocky', 'balboa']
          });

          expect(ruleObj).to.deep.equal({
            name: 'woosah',
            fullName: 'woosah:$1:$2',
            params: ['rocky', 'balboa']
          });
        });
      });
    });

    context('when the given rule is a string', () => {
      context('and it has no rule parameters', () => {
        it('should create valid ruleObj', () => {
          const ruleObj = validator._createRuleObject('minions');

          expect(ruleObj).to.deep.equal({
            name: 'minions',
            fullName: 'minions',
            params: []
          });
        });
      });

      context('and it has one rule parameter', () => {
        it('should create valid ruleObj', () => {
          const ruleObj = validator._createRuleObject('minions:banana');

          expect(ruleObj).to.deep.equal({
            name: 'minions',
            fullName: 'minions:$1',
            params: ['banana']
          });
        });
      });

      context('and it has two rule parameters', () => {
        it('should create valid ruleObj', () => {
          const ruleObj = validator._createRuleObject('minions:banana:hulala');

          expect(ruleObj).to.deep.equal({
            name: 'minions',
            fullName: 'minions:$1:$2',
            params: ['banana', 'hulala']
          });
        });
      });
    });
  });

  describe('.validate()', () => {
    const rules = {
      name: ['required'],
      officeEmail: ['required', 'email'],
      officeEmailOptional: ['email']
    };

    context('Test with simple rules', () => {
      it('should success', () => {
        const result = satpam.validate(rules, {
          name: 'sendy',
          officeEmail: 'asd@gg.com'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('name');
        expect(err).to.not.have.property('officeEmail');
        expect(err).to.not.have.property('officeEmailOptional');
      });

      it('should fail with empty name', () => {
        const result = satpam.validate(rules, {
          name: '',
          officeEmail: 'asd@gg.com'
        });
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('name');
        expect(err.name.required).to.equal('Name field is required.');
        expect(err.name).to.have.property('required');
        expect(err).to.not.have.property('officeEmail');
        expect(err).to.not.have.property('officeEmailOptional');
      });

      it('should fail with optional email', () => {
        const result = satpam.validate(rules, {
          name: 'sendy',
          officeEmail: 'asd@gg.com',
          officeEmailOptional: 'hehe'
        });
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('officeEmailOptional');
        expect(err.officeEmailOptional).to.have.property('email');
        expect(err).to.not.have.property('name');
        expect(err).to.not.have.property('officeEmail');
      });
    });

    context('Test with custom rules', () => {
      satpam.addCustomValidation('must-be-ironman', function (val) {
        return val === 'ironman';
      });
      satpam.setValidationMessage('must-be-ironman', 'Not ironman D:');

      const rules = {
        name: ['required', 'must-be-ironman'],
        phone: ['numeric']
      };

      it('should success', () => {
        const result = satpam.validate(rules, {
          name: 'ironman',
          phone: 123131
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('name');
        expect(err).to.not.have.property('phone');
      });

      it('should fail', () => {
        const result = satpam.validate(rules, {
          name: 'sendy',
          phone: 123131
        });
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('name');
        expect(err.name['must-be-ironman']).to.equal('Not ironman D:');
        expect(err).to.not.have.property('phone');
        expect(err.messageArray.length).to.equal(1);
        expect(err.messageArray[0]).to.equal('Not ironman D:');
      });
    });

    context('Test with rule params', () => {
      it('should fail with custom validation range:0:30', () => {
        satpam.addCustomValidation('range:$1:$2', function (val, ruleObj) {
          return val >= ruleObj.params[0] && val <= ruleObj.params[1];
        });
        satpam.setValidationMessage('range:$1:$2', '<%= propertyName %> must between <%= ruleParams[0] %> and <%= ruleParams[1] %>');

        const obj = { salary: 31 };
        const rules = { salary: ['range:0:30'] };
        const result = satpam.validate(rules, obj);
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err.salary['range:$1:$2']).to.equal('Salary must between 0 and 30');
        expect(err.messageArray.length).to.equal(1);
      });
    });

    context('Test with multiple errors', () => {
      it('should have multiple errors', () => {
        satpam.addCustomValidation('must-equal:$1', function (val, ruleObj) {
          return val === ruleObj.params[0];
        });
        satpam.setValidationMessage('must-equal:$1', '<%= propertyName %> must equal <%= ruleParams[0] %> !!');

        const obj = {
          officeEmail: 'asd@gg.com'
        };

        const rules = {
          name: ['must-equal:sendyhalim'],
          officeEmail: ['email'],
          address: ['must-equal:dimana aja bole', 'required'],
          title: ['required']
        };
        const result = satpam.validate(rules, obj);
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err.messageArray.length).to.equal(4);
        expect(err.name['must-equal:$1']).to.equal('Name must equal sendyhalim !!');
        expect(err.address['must-equal:$1']).to.equal('Address must equal dimana aja bole !!');
        expect(err.address['required']).to.equal('Address field is required.');
        expect(err.title['required']).to.equal('Title field is required.');
      });
    });

    context('when given invalid validation rule', () => {
      it('should throw error', () => {
        const rules = {
          test: ['invalid-rule']
        };

        const validate = () => {
          satpam.validate(rules, {});
        };

        expect(validate).to.throw(Error);
      });
    });
  });

  context('.getValidationMessage()', () => {
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

  context('.addCustomValidation()', () => {
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
});
