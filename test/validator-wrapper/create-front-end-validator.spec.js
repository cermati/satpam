import { expect } from 'chai';
import Validator from '../../lib/frontend/validator';
import minLength from '../../lib/validators/min-length';
import maxLength from '../../lib/validators/max-length';

describe('new Validator()', () => {
  context('when passing specific rules to Validator constructor', () => {
    const customValidator = new Validator({
      rules: {
        'minLength:$1': minLength.validate,
        'maxLength:$1': maxLength.validate
      },
      messages: {
        'minLength:$1': 'Must be at least <%= ruleParams[0] %> character(s).',
        'maxLength:$1': maxLength.message
      },
    });

    it('should be able to validate specified rules', () => {
      const failedResult = customValidator.validate(
        { token: ['minLength:11', 'maxLength:16'] },
        { token: '12345' }
      );

      expect(failedResult.success).to.be.false;
      expect(failedResult.messages.token['minLength:$1']).to.equal('Must be at least 11 character(s).');

      const successResult = customValidator.validate(
        { token: ['minLength:11', 'maxLength:16'] },
        { token: '12345678901' }
      );

      expect(successResult.success).to.be.true;
    });

    it('should not be able to validate unspecified rules', () => {
      expect(() => customValidator.validate(
        { token: ['required'] },
        { token: '12345' }
      )).to.throw(Error);
    });
  });
});

