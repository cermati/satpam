import { expect } from 'chai';
import moment from 'moment';
import validator from '../../lib';

describe('Time After Or Equal validator', () => {
  context('given a timeAfterOrEqual rule with parameter `now`', () => {
    const rules = {
      vacationTime: ['timeAfterOrEqual:now:0:minutes']
    };

    const getTestObject = () => {
      const futureTime = moment().add(1, 'second').utcOffset(0);

      return {
        vacationTime: futureTime
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has slightly older time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().subtract(1, 'second').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfterOrEqual:$1:$2:$3')
        .that.equals('Vacation Time must be greater than or equal to now.');
    });
  });

  context('given a timeAfterOrEqual rule with parameter `2019-06-03 15:22:01` in unix', () => {
    const rules = {
      vacationTime: ['timeAfterOrEqual:1559550121:0:minutes']
    };

    const getTestObject = () => {
      const futureTime = moment('2019-06-03 15:22:02').utcOffset(0);

      return {
        vacationTime: futureTime
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
        vacationTime: moment('2019-06-03 15:22:01').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });
  });

  context('given a timeAfterOrEqual rule with parameter `now` and -30 minutes', () => {
    const rules = {
      vacationTime: ['timeAfterOrEqual:now:-30:minutes']
    };

    const getTestObject = () => {
      const time = moment().subtract(30, 'minute').add(1, 'second').utcOffset(0);

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

    it('should fail when input has slightly older time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().subtract(30, 'minute').subtract(1, 'second').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfterOrEqual:$1:$2:$3')
        .that.equals('Vacation Time must be greater than or equal to now minus 30 minutes.');
    });
  });

  context('given a timeAfterOrEqual rule with parameter `now` and 30 seconds', () => {
    const rules = {
      vacationTime: ['timeAfterOrEqual:now:30:seconds']
    };

    const getTestObject = () => {
      const time = moment().add(31, 'seconds').utcOffset(0);

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

    it('should fail when input has slightly older time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().add(29, 'seconds').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfterOrEqual:$1:$2:$3')
        .that.equals('Vacation Time must be greater than or equal to now plus 30 seconds.');
    });
  });

  context('given a dateAfter rule with parameter `2019-06-03 15:22:01` in unix and -10 minutes', () => {
    const rules = {
      vacationTime: ['timeAfterOrEqual:1559550121:-10:minutes']
    };

    const getTestObject = () => {
      return {
        vacationTime: moment('2019-06-03 15:12:02').utcOffset(0)
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
        vacationTime: moment('2019-06-03 15:12:01').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });
  });

  context('given a timeAfterOrEqual rule with parameter `2019-06-03 15:22:01` in unix and 10 seconds', () => {
    const rules = {
      vacationTime: ['timeAfterOrEqual:1559550121:10:seconds']
    };

    const getTestObject = () => {
      return {
        vacationTime: moment('2019-06-03 15:22:12').utcOffset(0)
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
        vacationTime: moment('2019-06-03 15:22:11').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });
  });

  context('given a timeAfterOrEqual rule with parameter `2019-06-03 15:22:01` in unix and 5 hours', () => {
    const rules = {
      pastVacationTime: ['timeAfterOrEqual:1559550121:5:hours']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: moment('2019-06-03 20:22:02').utcOffset(0)
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
        pastVacationTime: moment('2019-06-03 20:22:01').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });
  });

  context('given a timeAfterOrEqual rule with parameter `2019-06-03 15:22:01` and -4 years', () => {
    const rules = {
      pastVacationTime: ['timeAfterOrEqual:1559550121:-4:years']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: moment('2015-06-03 15:22:02').utcOffset(0)
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
        pastVacationTime: moment('2015-06-03 15:22:01').utcOffset(0)
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });
  });
});
