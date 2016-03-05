import { expect } from 'chai';
import validator from '../../lib';

describe('Date Format validator', () => {
  context('given a dateFormat rule with format DD-MM-YYYY', () => {
    const simpleRules = {
      birthday: ['dateFormat:DD-MM-YYYY']
    };

    const getTestObject = () => {
      return {
        birthday: '02-09-1993'
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('birthday');
    });

    it('should fail with format YYYY-MM-DD', () => {
      const testObj = getTestObject();
      testObj.birthday = '1993-09-02';
      const result = validator.validate(simpleRules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format DD-MM-YYYY.');
    });

    it('should fail with format YYYY-DD-MM', () => {
      const testObj = getTestObject();
      testObj.birthday = '1993-02-09';
      const result = validator.validate(simpleRules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format DD-MM-YYYY.');
    });

    it('should fail with format DD-MM', () => {
      const testObj = getTestObject();
      testObj.birthday = '02-09';
      const result = validator.validate(simpleRules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format DD-MM-YYYY.');
    });
  });


  context('given a dateFormat rule with format MM/YYYY', () => {
    const simpleRules = {
      birthday: ['dateFormat:MM/YYYY']
    };

    const getTestObject = () => {
      return {
        birthday: '09/1993'
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('birthday');
    });

    it('should fail with format YYYY/MM/DD', () => {
      const testObj = getTestObject();
      testObj.birthday = '1993/09/02';
      const result = validator.validate(simpleRules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format MM/YYYY.');
    });

    it('should fail with format YYYY/MM', () => {
      const testObj = getTestObject();
      testObj.birthday = '2022/12';
      const result = validator.validate(simpleRules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format MM/YYYY.');
    });

    it('should fail with invalid date', () => {
      const testObj = getTestObject();
      testObj.birthday = '13/2012';
      const result = validator.validate(simpleRules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format MM/YYYY.');
    });
  });
});
