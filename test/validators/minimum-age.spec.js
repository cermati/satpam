import moment from 'moment';
import {expect} from 'chai';
import validator from '../../lib';

describe ('MinimumAge validator', () => {
  const rules = {
    birthDate: ['minimumAge:21:DD/MM/YYYY']
  };

  context('given valid age', () => {
    const birthDate = moment()
            .subtract(21, 'years')
            .format('DD/MM/YYYY');

    const result = validator.validate(rules, {
      birthDate: birthDate
    });

    it('should success', () => {
      expect(result.success).to.equal(true);
    });

    it('should not set validation message', () => {
      expect(result.messages.messageArray).to.be.empty;
      expect(result.messages).to.not.have.property('minimumAge:$1:$2');
    });
  });

  context('given invalid age', () => {
    const birthDate = moment()
            .subtract(21, 'years')
            .add(1, 'day')
            .format('DD/MM/YYYY');

    const result = validator.validate(rules, {
      birthDate: birthDate
    });

    it('should fail', () => {
      expect(result.success).to.equal(false);
    });

    it('should set validation message', () => {
      expect(result.messages.messageArray).to.deep.equal([
        'Minimum age is 21 years old.'
      ]);

      expect(result.messages.birthDate).to.have.property('minimumAge:$1:$2')
        .that.equals('Minimum age is 21 years old.');
    });
  });
});
