import { expect } from 'chai';
import satpam from '../../lib';

// satpam.validate() reuses one internal validator that reads the global rules and
// messages directly instead of cloning them per call. These specs pin that the
// observable behaviour is the same as a freshly created (cloned) validator.
describe('satpam.validate() shared validator', () => {
  const rules = {
    name: ['required', 'string', 'maxLength:5'],
    email: ['required', 'email'],
    age: ['required', 'integer', 'minValue:17'],
    address: {
      city: ['required']
    }
  };

  context('when the same input is validated by satpam.validate() and by a new satpam.create() instance', () => {
    const inputs = [
      { name: 'Budi', email: 'budi@example.com', age: 20, address: { city: 'Jakarta' } },
      { name: 'Budiman Santoso', email: 'not-an-email', age: 10, address: {} },
      {}
    ];

    inputs.forEach((input, index) => {
      it(`should return identical results for input #${index}`, () => {
        const sharedResult = satpam.validate(rules, input);
        const freshResult = satpam.create().validate(rules, input);

        expect(sharedResult).to.deep.equal(freshResult);
      });
    });
  });

  context('when calls alternate between failing and passing input', () => {
    it('should not carry messages over from a previous call', () => {
      const failed = satpam.validate(rules, { name: 'Budiman Santoso' });
      const passed = satpam.validate(rules, { name: 'Budi', email: 'budi@example.com', age: 20, address: { city: 'Jakarta' } });

      expect(failed.success).to.be.false;
      expect(passed.success).to.be.true;
      expect(passed.messages).to.deep.equal({});
    });
  });

  context('when a global custom validation is added after satpam.validate() was already used', () => {
    before('use satpam.validate() once, then add the global rule', () => {
      satpam.validate({ name: ['required'] }, { name: 'warm-up' });
      satpam.addCustomValidation('sharedValidatorSpecIsYo', val => val === 'yo');
      satpam.setValidationMessage('sharedValidatorSpecIsYo', '<%= propertyName %> must be yo.');
    });

    it('should apply the new global rule', () => {
      const ruleMapping = { greeting: ['sharedValidatorSpecIsYo'] };

      expect(satpam.validate(ruleMapping, { greeting: 'yo' }).success).to.be.true;
      expect(satpam.validate(ruleMapping, { greeting: 'hi' }).success).to.be.false;
    });

    it('should use the new global validation message', () => {
      const result = satpam.validate({ greeting: ['sharedValidatorSpecIsYo'] }, { greeting: 'hi' });

      expect(result.messages.greeting.sharedValidatorSpecIsYo).to.equal('Greeting must be yo.');
    });
  });

  context('when a satpam.create() instance customizes its own rule and message', () => {
    const validator = satpam.create();

    before('customize the instance only', () => {
      validator.addCustomValidation('email', () => false);
      validator.setValidationMessage('email', 'instance only message');
    });

    it('should not leak into satpam.validate()', () => {
      const result = satpam.validate({ email: ['email'] }, { email: 'budi@example.com' });

      expect(result.success).to.be.true;
    });

    it('should still apply to the instance itself', () => {
      const result = validator.validate({ email: ['email'] }, { email: 'budi@example.com' });

      expect(result.success).to.be.false;
      expect(result.messages.email.email).to.equal('instance only message');
    });
  });
});
