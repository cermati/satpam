import { expect } from 'chai';
import Validator from '../../lib/frontend/validator';
import minLength from '../../lib/validators/min-length';
import maxLength from '../../lib/validators/max-length';
import required from '../../lib/validators/required';

describe('new Validator()', () => {
  context('when using specific rules and custom messages', () => {
    const customValidator = new Validator({
      validators: [maxLength, minLength, required]
    });

    customValidator.setValidationMessage(required.fullName, 'Missing required field <%= propertyName %>.');
    customValidator.setValidationMessage(minLength.fullName, 'Must be at least <%= ruleParams[0] %> character(s).');

    it('should be able to validate specified rules', () => {
      const failedResult = customValidator.validate(
        { token: ['minLength:11', 'maxLength:16'], id: ['required'] },
        { token: '12345' }
      );

      expect(failedResult.success).to.be.false;
      expect(failedResult.messages.token['minLength:$1']).to.equal('Must be at least 11 character(s).');
      expect(failedResult.messages.id['required']).to.equal('Missing required field Id.');

      const successResult = customValidator.validate(
        { token: ['minLength:11', 'maxLength:16'] },
        { token: '12345678901' }
      );

      expect(successResult.success).to.be.true;
    });

    it('should not be able to validate unspecified rules', () => {
      expect(() => customValidator.validate(
        { token: ['numeric'] },
        { token: '12345' }
      )).to.throw(Error);
    });
  });
});

