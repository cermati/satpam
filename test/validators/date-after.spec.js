import { expect } from 'chai';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import validator from '../../lib';

dayjs.extend(customParseFormat);

describe('Date After validator', () => {
  context('given a dateAfter rule with parameter `now`', () => {
    const rules = {
      vacationDate: ['dateAfter:DD/MM/YYYY:now:0:days']
    };

    const getTestObject = () => {
      const futureDate = dayjs().add(1, 'day').format('DD/MM/YYYY');

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

    it('should fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: dayjs().format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than now.');
    });
  });

  context('given a dateAfter rule with parameter 01-2014', () => {
    const rules = {
      vacationDate: ['dateAfter:MM-YYYY:01-2014:0:days']
    };

    const getTestObject = () => {
      const futureDate = dayjs('02-2014', 'MM-YYYY');

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

    it('should fail when input has the same month', () => {
      const result = validator.validate(rules, {
        vacationDate: dayjs('01-2014', 'MM-YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than 01-2014.');
    });
  });

  context('given a dateAfter rule with parameter `now` and -365 days', () => {
    const rules = {
      vacationDate: ['dateAfter:DD/MM/YYYY:now:-365:days']
    };

    const getTestObject = () => {
      const date = dayjs().subtract(364, 'days').format('DD/MM/YYYY');

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

    it('should fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: dayjs().subtract(365, 'days').format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than now minus 365 days.');
    });
  });

  context('given a dateAfter rule with parameter `now` and 40 days', () => {
    const rules = {
      vacationDate: ['dateAfter:DD/MM/YYYY:now:40:days']
    };

    const getTestObject = () => {
      const date = dayjs().add(41, 'days').format('DD/MM/YYYY');

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

    it('should fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: dayjs().add(40, 'days').format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than now plus 40 days.');
    });
  });

  context('given a dateAfter rule with parameter `02-09` and -10 days', () => {
    const rules = {
      vacationDate: ['dateAfter:DD-MM:02-09:-10:days']
    };

    const getTestObject = () => {
      return {
        vacationDate: '24-08'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: '23-08'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than 02-09 minus 10 days.');
    });
  });

  context('given a dateAfter rule with parameter `12-09` and 10 days', () => {
    const rules = {
      vacationDate: ['dateAfter:DD-MM:12-09:10:days']
    };

    const getTestObject = () => {
      return {
        vacationDate: '23-09'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: '22-09'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than 12-09 plus 10 days.');
    });
  });

  context('given a dateAfter rule with parameter `12-09` and 3 months', () => {
    const rules = {
      pastVacationDate: ['dateAfter:DD-MM:12-09:3:months']
    };

    const getTestObject = () => {
      return {
        pastVacationDate: '13-12'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should fail when input has the same date', () => {
      const result = validator.validate(rules, {
        pastVacationDate: '12-12'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationDate');
      expect(err.pastVacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Past Vacation Date must greater than 12-09 plus 3 months.');
    });
  });

  context('given a dateAfter rule with parameter `04-06-2015` and -4 years', () => {
    const rules = {
      pastVacationDate: ['dateAfter:DD-MM-YYYY:04-06-2015:-4:years']
    };

    const getTestObject = () => {
      return {
        pastVacationDate: '05-06-2011'
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should fail when input has the same date', () => {
      const result = validator.validate(rules, {
        pastVacationDate: '04-06-2011'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationDate');
      expect(err.pastVacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Past Vacation Date must greater than 04-06-2015 minus 4 years.');
    });
  });
});
