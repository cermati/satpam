import { expect } from 'chai';
import dayjs from 'dayjs';
import validator from '../../lib';

describe('Time After Or Equal validator', () => {
  context('given a timeAfterOrEqual rule with parameter `now`', () => {
    const rules = {
      vacationTime: ['timeAfterOrEqual:now:0:minutes']
    };

    const getTestObject = () => {
      const futureTime = dayjs().add(1, 'seconds');

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
        vacationTime: dayjs().subtract(1, 'seconds')
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
      const futureTime = dayjs('2019-06-03T08:22:02Z');

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
        vacationTime: dayjs('2019-06-03T08:22:01Z')
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
      const time = dayjs().subtract(30, 'minutes').add(1, 'seconds');

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
        vacationTime: dayjs().subtract(30, 'minutes').subtract(1, 'seconds')
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
      const time = dayjs().add(31, 'seconds');

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
        vacationTime: dayjs().add(29, 'seconds')
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
        vacationTime: dayjs('2019-06-03T08:12:02Z')
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
        vacationTime: dayjs('2019-06-03T08:12:01Z')
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
        vacationTime: dayjs('2019-06-03T08:22:12Z')
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
        vacationTime: dayjs('2019-06-03T08:22:11Z')
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
        pastVacationTime: dayjs('2019-06-03T13:22:02Z')
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
        pastVacationTime: dayjs('2019-06-03T13:22:01Z')
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
        pastVacationTime: dayjs('2015-06-03T08:22:02Z')
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
        pastVacationTime: dayjs('2015-06-03T08:22:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });
  });
});
