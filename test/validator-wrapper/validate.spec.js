import { expect } from 'chai';
import satpam from '../../lib';

describe('Validator.validate()', () => {
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

  context('when given optional validation rules', () => {
    const rules = {
      number: [['numeric', 'length:5'], 'required']
    };

    it('should fail with empty input', () => {
      const result = satpam.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.be.false;
      expect(err.number.required).to.equal('Number field is required.');
    });

    it('should fail if input length is not 5 and input is not numeric', () => {
      const result = satpam.validate(rules, {
        number: 'testyo'
      });

      const err = result.messages;

      expect(result.success).to.be.false;
      expect(err.number.numeric).to.equal('Number must be a number.');
      expect(err.number['length:$1']).to.equal('Number must have length of 5 character(s).');
    });

    it('should success if the first rule of optional rules is satisfied', () => {
      const result = satpam.validate(rules, {
        number: '1234'
      });

      const err = result.messages;

      expect(result.success).to.be.true;
      expect(err.messageArray).to.be.empty;
    });

    it('should success if the second rule of optional rules is satisfied', () => {
      const result = satpam.validate(rules, {
        number: 'tests'
      });

      const err = result.messages;

      expect(result.success).to.be.true;
      expect(err.messageArray).to.be.empty;
    });

    it('should success if all the rules are satisfied', () => {
      const result = satpam.validate(rules, {
        number: '12345'
      });

      const err = result.messages;

      expect(result.success).to.be.true;
      expect(err.messageArray).to.be.empty;
    });
  });
});

