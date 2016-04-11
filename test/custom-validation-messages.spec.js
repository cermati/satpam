import util from 'util';
import {expect} from 'chai';
import satpam from '../lib';

describe('Validator.setValidationMessage()', () => {
  describe('given a message that is a string', () => {
    const validator = satpam.create();
    const rule = {name: ['minLength:20']};

    validator.setValidationMessage('minLength:$1', 'yo watt');
    const result = validator.validate(rule, {name: 'a'});

    it('should return correct validation message array', () => {
      expect(result.messages.messageArray).to.deep.equal(['yo watt']);
    });

    it('should return correct validation message', () => {
      expect(result.messages.name['minLength:$1']).to.equal('yo watt');
    });
  });

  describe('given a message that is a function', () => {
    const validator = satpam.create();
    const rule = {name: ['minLength:20']};

    validator.setValidationMessage('minLength:$1', (ruleObj, propertyName, value) => {
      return util.format(
        'name: %s, fullName: %s, params: %s, propertyName: %s, value: %s',
        ruleObj.name,
        ruleObj.fullName,
        ruleObj.params,
        propertyName,
        value
      );
    });

    const result = validator.validate(rule, {name: 'wubwub'});
    const expected = 'name: minLength, fullName: minLength:$1, params: 20, propertyName: name, value: wubwub';

    it('should return correct validation message array', () => {
      expect(result.messages.messageArray).to.deep.equal([expected]);
    });

    it('should return correct validation message', () => {
      expect(result.messages.name['minLength:$1']).to.equal(expected);
    });
  });
});
