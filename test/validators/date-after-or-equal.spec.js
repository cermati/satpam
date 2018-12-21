import { expect } from 'chai';
import moment from 'moment';
import validator from '../../lib';

describe('Date After Or Equal validator', () => {
  context('given a dateAfterOrEqual rule with parameter `now`', () => {
    const rules = {
      vacationDate: ['dateAfterOrEqual:DD/MM/YYYY:now:0:days']
    };

    const getTestObject = () => {
      const futureDate = moment().add(1, 'day').format('DD/MM/YYYY');

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

    it('should not fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });
  });

  context('given a dateAfterOrEqual rule with parameter 01-2014', () => {
    const rules = {
      vacationDate: ['dateAfterOrEqual:MM-YYYY:01-2014:0:days']
    };

    const getTestObject = () => {
      const futureDate = moment('02-2014', 'MM-YYYY');

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

    it('should not fail when input has the same month', () => {
      const result = validator.validate(rules, {
        vacationDate: moment('01-2014', 'MM-YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });
  });

  context('given a dateAfterOrEqual rule with parameter `now` and -365 days', () => {
    const rules = {
      vacationDate: ['dateAfterOrEqual:DD/MM/YYYY:now:-365:days']
    };

    const getTestObject = () => {
      const date = moment().subtract(364, 'days').format('DD/MM/YYYY');

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

    it('should not fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().subtract(365, 'days').format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });
  });

  context('given a dateAfterOrEqual rule with parameter `now` and 40 days', () => {
    const rules = {
      vacationDate: ['dateAfterOrEqual:DD/MM/YYYY:now:40:days']
    };

    const getTestObject = () => {
      const date = moment().add(41, 'days').format('DD/MM/YYYY');

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

    it('should not fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: moment().add(40, 'days').format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });
  });

  context('given a dateAfterOrEqual rule with parameter `02-09` and -10 days', () => {
    const rules = {
      vacationDate: ['dateAfterOrEqual:DD-MM:02-09:-10:days']
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

    it('should not fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: '23-08'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });
  });

  context('given a dateAfterOrEqual rule with parameter `12-09` and 10 days', () => {
    const rules = {
      vacationDate: ['dateAfterOrEqual:DD-MM:12-09:10:days']
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

    it('should not fail when input has the same date', () => {
      const result = validator.validate(rules, {
        vacationDate: '22-09'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });
  });

  context('given a dateAfterOrEqual rule with parameter `12-09` and 3 months', () => {
    const rules = {
      pastVacationDate: ['dateAfterOrEqual:DD-MM:12-09:3:months']
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

    it('should not fail when input has the same date', () => {
      const result = validator.validate(rules, {
        pastVacationDate: '12-12'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateAfterOrEqual rule with parameter `04-06-2015` and -4 years', () => {
    const rules = {
      pastVacationDate: ['dateAfterOrEqual:DD-MM-YYYY:04-06-2015:-4:years']
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

    it('should not fail when input has the same date', () => {
      const result = validator.validate(rules, {
        pastVacationDate: '04-06-2011'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });
});
