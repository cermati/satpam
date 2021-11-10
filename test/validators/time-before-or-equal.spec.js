import { expect } from 'chai';
import moment from 'moment';
import validator from '../../lib';

describe('Time Before Or Equal validator', () => {
  context('given a timeBeforeOrEqual rule with parameter `now`', () => {
    const rules = {
      vacationTime: ['timeBeforeOrEqual:now:0:minutes']
    };

    const getTestObject = () => {
      const pastTime = moment().subtract(1, 'seconds');

      return {
        vacationTime: pastTime
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has slightly more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().add(1, 'seconds')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBeforeOrEqual:$1:$2:$3')
        .that.equals('Vacation Time must be less than or equal to now.');
    });
  });

  context('given a timeBeforeOrEqual rule with parameter `2019-06-03 15:22:01` in unix', () => {
    const rules = {
      vacationTime: ['timeBeforeOrEqual:1559550121:0:minutes']
    };

    const getTestObject = () => {
      const pastTime = moment('2019-06-03T08:22:00Z');

      return {
        vacationTime: pastTime
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should not fail when input has the same time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03T08:22:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should  fail when input has more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03T08:22:02Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
    });
  });

  context('given a timeBeforeOrEqual rule with parameter `now` and -30 minutes', () => {
    const rules = {
      vacationTime: ['timeBeforeOrEqual:now:-30:minutes']
    };

    const getTestObject = () => {
      const time = moment().subtract(30, 'minutes').subtract(1, 'seconds');

      return {
        vacationTime: time
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has slightly more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().subtract(30, 'minutes').add(1, 'second'),
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBeforeOrEqual:$1:$2:$3')
        .that.equals('Vacation Time must be less than or equal to now minus 30 minutes.');
    });
  });

  context('given a timeBeforeOrEqual rule with parameter `now` and 30 seconds', () => {
    const rules = {
      vacationTime: ['timeBeforeOrEqual:now:30:seconds']
    };

    const getTestObject = () => {
      const time = moment().add(29, 'seconds');

      return {
        vacationTime: time
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has slightly more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().add(31, 'seconds')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBeforeOrEqual:$1:$2:$3')
        .that.equals('Vacation Time must be less than or equal to now plus 30 seconds.');
    });
  });

  context('given a dateAfter rule with parameter `2019-06-03 15:22:01` in unix and -10 minutes', () => {
    const rules = {
      vacationTime: ['timeBeforeOrEqual:1559550121:-10:minutes']
    };

    const getTestObject = () => {
      return {
        vacationTime: moment('2019-06-03T08:12:00Z')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should not fail when input has the same time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03T08:12:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03T08:12:02Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
    });
  });

  context('given a timeBeforeOrEqual rule with parameter `2019-06-03 15:22:01` in unix and 10 seconds', () => {
    const rules = {
      vacationTime: ['timeBeforeOrEqual:1559550121:10:seconds']
    };

    const getTestObject = () => {
      return {
        vacationTime: moment('2019-06-03T08:22:10Z')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should not fail when input has the same time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03T08:22:11Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03T08:22:12Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
    });
  });

  context('given a timeBeforeOrEqual rule with parameter `2019-06-03 15:22:01` in unix and 5 hours', () => {
    const rules = {
      pastVacationTime: ['timeBeforeOrEqual:1559550121:5:hours']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: moment('2019-06-03T13:22:00Z')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });

    it('should not fail when input has the same time', () => {
      const result = validator.validate(rules, {
        pastVacationTime: moment('2019-06-03T13:22:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });

    it('should fail when input has more recent time', () => {
      const result = validator.validate(rules, {
        pastVacationTime: moment('2019-06-03T13:22:02Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationTime');
    });
  });

  context('given a timeBeforeOrEqual rule with parameter `2019-06-03 15:22:01` and -4 years', () => {
    const rules = {
      pastVacationTime: ['timeBeforeOrEqual:1559550121:-4:years']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: moment('2015-06-03T08:22:00Z')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });

    it('should not fail when input has the same time', () => {
      const result = validator.validate(rules, {
        pastVacationTime: moment('2015-06-03T08:22:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });

    it('should fail when input has more recent time', () => {
      const result = validator.validate(rules, {
        pastVacationTime: moment('2015-06-03T08:22:02Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationTime');
    });
  });
});
