import { expect } from 'chai';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import validator from '../../lib';

dayjs.extend(customParseFormat);

describe('Date Time Before Or Equal validator', () => {
  context('given a dateTimeBeforeOrEqual rule with parameter `now`', () => {
    const rules = {
      vacationDate: ['dateTimeBeforeOrEqual:YYYYMMDDHHmm:now:0:minutes']
    };

    const getTestObject = () => {
      const passDate = dayjs().subtract(1, 'minutes').format('YYYYMMDDHHmm');

      return {
        vacationDate: passDate
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
        vacationDate: dayjs().format('YYYYMMDDHHmm')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
    });

    it('should fail when input after timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: dayjs().add(1, 'minutes').format('YYYYMMDDHHmm')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBeforeOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than or equal to now.');
    });
  });

  context('given a dateTimeBeforeOrEqual rule with parameter 2015-05-12 10:45:00.555+07', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBeforeOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss.SSS[Z]', '2015-05-12T10:45:00.555+07', 0, 'milliseconds'],
      }]
    };

    const getTestObject = () => {
      const passDate = dayjs('2015-05-12T10:45:00.550+07', 'YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      return {
        vacationDate: passDate
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
        vacationDate: dayjs('2015-05-12T10:45:00.560+07', 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBeforeOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than or equal to 2015-05-12T10:45:00.555+07.');
    });
  });

  context('given a dateTimeBeforeOrEqual rule with parameter `now` and -5 seconds', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBeforeOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss', 'now', -5, 'seconds'],
      }]
    };

    const getTestObject = () => {
      const date = dayjs().subtract(6, 'seconds').format('YYYY-MM-DDTHH:mm:ss');

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

    it('should fail when input is 4 seconds ago', () => {
      const result = validator.validate(rules, {
        vacationDate: dayjs().subtract(4, 'seconds').format('YYYY-MM-DDTHH:mm:ss')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBeforeOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than or equal to now minus 5 seconds.');
    });
  });

  context('given a dateTimeBeforeOrEqual rule with parameter `now` and 10 minutes', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBeforeOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss', 'now', 10, 'minutes'],
      }]
    };

    const getTestObject = () => {
      const date = dayjs().add(9, 'minutes').format('YYYY-MM-DDTHH:mm:ss');

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

    it('should fail when input 11 minutes after now', () => {
      const result = validator.validate(rules, {
        vacationDate: dayjs().add(11, 'minutes').format('YYYY-MM-DDTHH:mm:ss')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBeforeOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than or equal to now plus 10 minutes.');
    });
  });

  context('given a dateTimeBeforeOrEqual rule with parameter `2015-05-12T10:45:00` and -10 hours', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBeforeOrEqual',
        params: ['YYYY-MM-DDTHH:mm:ss', '2015-05-12T10:45:00', -10, 'hours'],
      }]
    };

    const getTestObject = () => {
      return {
        vacationDate: '2015-05-12T00:45:00'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input is 9 hours before given timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: '2015-05-12T01:45:00'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBeforeOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than or equal to 2015-05-12T10:45:00 minus 10 hours.');
    });
  });

  context('given a dateTimeBeforeOrEqual rule with parameter `2015-05-12T10:45:00` and 10 hours', () => {
    const rules = {
      vacationDate: [{
        name: 'dateTimeBeforeOrEqual',
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

    it('should fail when input is 11 hours after given timestamp', () => {
      const result = validator.validate(rules, {
        vacationDate: '2015-05-12T21:45:00'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateTimeBeforeOrEqual:$1:$2:$3:$4')
        .that.equals('Vacation Date must be less than or equal to 2015-05-12T10:45:00 plus 10 hours.');
    });
  });
});
