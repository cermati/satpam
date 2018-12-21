import { expect } from 'chai';
import moment from 'moment';
import validator from '../../lib';

describe('Date Before validator', () => {
  context('given a dateBeforeOrEqual rule with parameter `now`', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:DD/MM/YYYY:now:0:days']
    };

    const getTestObject = () => {
      const pastDate = moment().subtract(1, 'day').format('DD/MM/YYYY');

      return {
        pastVacationDate: pastDate
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same date', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: moment().format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateBeforeOrEqual rule with parameter 01-2014', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:MM-YYYY:01-2014:0:days']
    };

    const getTestObject = () => {
      const pastDate = moment('12-2013', 'MM-YYYY');

      return {
        pastVacationDate: pastDate
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same month', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: moment('01-2014', 'MM-YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateBeforeOrEqual rule with parameter `now` and -365 days', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:DD/MM/YYYY:now:-365:days']
    };

    const getTestObject = () => {
      const pastDate = moment().subtract(366, 'days').format('DD/MM/YYYY');

      return {
        pastVacationDate: pastDate
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same date', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: moment().subtract(365, 'days').format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateBeforeOrEqual rule with parameter `now` and 40 days', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:DD/MM/YYYY:now:40:days']
    };

    const getTestObject = () => {
      const pastDate = moment().add(39, 'days').format('DD/MM/YYYY');

      return {
        pastVacationDate: pastDate
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same date', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: moment().add(40, 'days').format('DD/MM/YYYY')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateBeforeOrEqual rule with parameter `02-09` and -10 days', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:DD-MM:02-09:-10:days']
    };

    const getTestObject = () => {
      return {
        pastVacationDate: '22-08'
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same date', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: '23-08'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateBeforeOrEqual rule with parameter `12-09` and 10 days', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:DD-MM:12-09:10:days']
    };

    const getTestObject = () => {
      return {
        pastVacationDate: '21-09'
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same date', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: '22-09'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateBeforeOrEqual rule with parameter `12-09` and 3 months', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:DD-MM:12-09:3:months']
    };

    const getTestObject = () => {
      return {
        pastVacationDate: '11-12'
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same date', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: '12-12'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });

  context('given a dateBeforeOrEqual rule with parameter `04-06-2015` and -4 years', () => {
    const simpleRules = {
      pastVacationDate: ['dateBeforeOrEqual:DD-MM-YYYY:04-06-2015:-4:years']
    };

    const getTestObject = () => {
      return {
        pastVacationDate: '03-06-2011'
      };
    };

    it('should success', () => {
      const result = validator.validate(simpleRules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should not fail when input has the same date', () => {
      const result = validator.validate(simpleRules, {
        pastVacationDate: '04-06-2011'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });
  });
});
