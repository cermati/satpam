import { expect } from 'chai';
import moment from 'moment';
import validator from '../../lib';

describe('Date Time Before validator', () => {
  context('given a dateTimeBefore rule with parameter `now`', () => {
    const rules = {
      vacationDate: ['dateTimeBefore:YYYYMMDDHHmm:now:0:minutes']
    };

    const getTestObject = () => {
      const futureDate = moment().subtract(1, 'minutes').format('YYYYMMDDHHmm');

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

    it('should fail when input has the same timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().format('YYYYMMDDHHmm')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBefore:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than now.');
    });
  });

  context('given a dateTimeBefore rule with parameter 2015-05-12 10:45:00.555+07', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBefore',
        params: ['YYYY-MM-DDTHH:mm:ss.SSS[Z]', '2015-05-12T10:45:00.555+07', 0, 'milliseconds'],
      }]
    };

    const getTestObject = () => {
      const pastDate = moment('2015-05-12T10:45:00.550+07', 'YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      return {
        vacationDate: pastDate
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 5 milliseconds later', () => {
      const result = validator.validate(rules, {
        vacationDate: moment('2015-05-12T10:45:00.560+07', 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBefore:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than 2015-05-12T10:45:00.555+07.');
    });
  });

  context('given a dateTimeBefore rule with parameter `now` and -5 seconds', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBefore',
        params: ['YYYY-MM-DDTHH:mm:ss', 'now', -5, 'seconds'],
      }]
    };

    const getTestObject = () => {
      const date = moment().subtract(6, 'seconds').format('YYYY-MM-DDTHH:mm:ss');

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

    it('should fail when input is 5 seconds after', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().add(5, 'seconds').format('YYYY-MM-DDTHH:mm:ss')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBefore:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than now minus 5 seconds.');
    });
  });

  context('given a dateTimeBefore rule with parameter `now` and 10 minutes', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBefore',
        params: ['YYYY-MM-DDTHH:mm:ss', 'now', 10, 'minutes'],
      }]
    };

    const getTestObject = () => {
      const date = moment().add(9, 'minutes').format('YYYY-MM-DDTHH:mm');

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

    it('should fail when input is 10 minutes after now', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().add(10, 'minutes').format('YYYY-MM-DDTHH:mm')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBefore:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than now plus 10 minutes.');
    });
  });

  context('given a dateTimeBefore rule with parameter `2015-05-12T10:45:00` and -10 hours', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBefore',
        params: ['YYYY-MM-DDTHH:mm:ss', '2015-05-12T10:45:00', -10, 'hours'],
      }]
    };

    const getTestObject = () => {
      return {
        vacationDate: '2015-05-11T23:45:00'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 10 hours after given timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: '2015-05-12T20:45:00'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBefore:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than 2015-05-12T10:45:00 minus 10 hours.');
    });
  });

  context('given a dateTimeBefore rule with parameter `2015-05-12T10:45:00` and 10 hours', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBefore',
        params: ['YYYY-MM-DDTHH:mm:ss', '2015-05-12T10:45:00', 10, 'hours'],
      }]
    };

    const getTestObject = () => {
      return {
        vacationDate: '2015-05-12T19:45:00'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 10 hours after given timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: '2015-05-12T20:45:00'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBefore:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than 2015-05-12T10:45:00 plus 10 hours.');
    });
  });
});
