import { expect } from 'chai';
import moment from 'moment';
import validator from '../../lib';

describe('Date After validator', () => {
  context('given a dateTimeAfterOrEqual rule with parameter `now`', () => {
    const rules = {
      vacationDate: ['dateTimeAfterOrEqual:YYYYMMDDHHmm:now:0:minutes']
    };

    const getTestObject = () => {
      const futureDate = moment().add(1, 'minutes').format('YYYYMMDDHHmm');

      return {
        vacationDate: futureDate
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should success when input has the same timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().format('YYYYMMDDHHmm')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
    });

    it('should fail when input before timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().subtract(1, 'minutes').format('YYYYMMDDHHmm')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeAfterOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be greater than or equal to now.');
    });
  });

  context('given a dateTimeAfterOrEqual rule with parameter 2015-05-12 10:45:00.555+07', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeAfterOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss.SSS[Z]', '2015-05-12T10:45:00.555+07', 0, 'milliseconds'],
      }]
    };

    const getTestObject = () => {
      const futureDate = moment('2015-05-12T10:45:00.560+07', 'YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      return {
        vacationDate: futureDate
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 5 milliseconds faster', () => {
      const result = validator.validate(rules, {
        vacationDate: moment('2015-05-12T10:45:00.550+07', 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeAfterOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be greater than or equal to 2015-05-12T10:45:00.555+07.');
    });
  });

  context('given a dateTimeAfterOrEqual rule with parameter `now` and -5 seconds', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeAfterOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss', 'now', -5, 'seconds'],
      }]
    };

    const getTestObject = () => {
      const date = moment().subtract(4, 'seconds').format('YYYY-MM-DDTHH:mm:ss');

      return {
        vacationDate: date
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 6 seconds ago', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().subtract(6, 'seconds').format('YYYY-MM-DDTHH:mm:ss')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeAfterOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be greater than or equal to now minus 5 seconds.');
    });
  });

  context('given a dateTimeAfterOrEqual rule with parameter `now` and 10 minutes', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeAfterOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss', 'now', 10, 'minutes'],
      }]
    };

    const getTestObject = () => {
      const date = moment().add(11, 'minutes').format('YYYY-MM-DDTHH:mm');

      return {
        vacationDate: date
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input 9 minutes after now', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().add(9, 'minutes').format('YYYY-MM-DDTHH:mm')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeAfterOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be greater than or equal to now plus 10 minutes.');
    });
  });

  context('given a dateTimeAfterOrEqual rule with parameter `2015-05-12T10:45:00` and -10 hours', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeAfterOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss', '2015-05-12T10:45:00', -10, 'hours'],
      }]
    };

    const getTestObject = () => {
      return {
        vacationDate: '2015-05-12T10:45:00'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 11 hours before given timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: '2015-05-11T23:45:00'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeAfterOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be greater than or equal to 2015-05-12T10:45:00 minus 10 hours.');
    });
  });

  context('given a dateTimeAfterOrEqual rule with parameter `2015-05-12T10:45:00` and 10 hours', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeAfterOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss', '2015-05-12T10:45:00', 10, 'hours'],
      }]
    };

    const getTestObject = () => {
      return {
        vacationDate: '2015-05-12T21:45:00'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 9 hours after given timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: '2015-05-12T19:45:00'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeAfterOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be greater than or equal to 2015-05-12T10:45:00 plus 10 hours.');
    });
  });
});
