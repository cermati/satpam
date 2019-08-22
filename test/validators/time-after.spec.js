import { expect } from 'chai';
import moment from 'moment';
import validator from '../../lib';

describe('Time After validator', () => {
  context('given a timeAfter rule with parameter `now`', () => {
    const rules = {
      vacationTime: ['timeAfter:now:0:minutes']
    };

    const getTestObject = () => {
      const futureTime = moment().add(1, 'second');

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

    it('should fail when input has the same time or slightly older time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment()
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Vacation Time must be greater than now.');
    });
  });

  context('given a timeAfter rule with parameter `2019-06-03 15:22:01` in unix', () => {
    const rules = {
      vacationTime: ['timeAfter:1559550121:0:minutes']
    };

    const getTestObject = () => {
      const futureTime = moment('2019-06-03 15:22:02');

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

    it('should fail when input has the same time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03 15:22:01')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Vacation Time must be greater than 2019-06-03 15:22:01.');
    });
  });

  context('given a timeAfter rule with parameter `now` and -30 minutes', () => {
    const rules = {
      vacationTime: ['timeAfter:now:-30:minutes']
    };

    const getTestObject = () => {
      const time = moment().subtract(30, 'minute').add(1, 'second');

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

    it('should fail when input has the same time or slightly older time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().subtract(30, 'minute')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Vacation Time must be greater than now minus 30 minutes.');
    });
  });

  context('given a timeAfter rule with parameter `now` and 30 seconds', () => {
    const rules = {
      vacationTime: ['timeAfter:now:30:seconds']
    };

    const getTestObject = () => {
      const time = moment().add(31, 'seconds');

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

    it('should fail when input has the same time or slightly older time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment().add(30, 'seconds')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Vacation Time must be greater than now plus 30 seconds.');
    });
  });

  context('given a dateAfter rule with parameter `2019-06-03 15:22:01` in unix and -10 minutes', () => {
    const rules = {
      vacationTime: ['timeAfter:1559550121:-10:minutes']
    };

    const getTestObject = () => {
      return {
        vacationTime: moment('2019-06-03 15:12:02')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has the same time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03 15:12:01')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Vacation Time must be greater than 2019-06-03 15:22:01 minus 10 minutes.');
    });
  });

  context('given a timeAfter rule with parameter `2019-06-03 15:22:01` in unix and 10 seconds', () => {
    const rules = {
      vacationTime: ['timeAfter:1559550121:10:seconds']
    };

    const getTestObject = () => {
      return {
        vacationTime: moment('2019-06-03 15:22:12')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationTime');
    });

    it('should fail when input has the same time', () => {
      const result = validator.validate(rules, {
        vacationTime: moment('2019-06-03 15:22:11')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Vacation Time must be greater than 2019-06-03 15:22:01 plus 10 seconds.');
    });
  });

  context('given a timeAfter rule with parameter `2019-06-03 15:22:01` in unix and 5 hours', () => {
    const rules = {
      pastVacationTime: ['timeAfter:1559550121:5:hours']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: moment('2019-06-03 20:22:02')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });

    it('should fail when input has the same time', () => {
      const result = validator.validate(rules, {
        pastVacationTime: moment('2019-06-03 20:22:01')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationTime');
      expect(err.pastVacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Past Vacation Time must be greater than 2019-06-03 15:22:01 plus 5 hours.');
    });
  });

  context('given a timeAfter rule with parameter `2019-06-03 15:22:01` and -4 years', () => {
    const rules = {
      pastVacationTime: ['timeAfter:1559550121:-4:years']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: moment('2015-06-03 15:22:02')
      };
    };

    it('should success', () => {
      const result = validator.validate(rules, getTestObject());
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationTime');
    });

    it('should fail when input has the same time', () => {
      const result = validator.validate(rules, {
        pastVacationTime: moment('2015-06-03 15:22:01')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationTime');
      expect(err.pastVacationTime).to.have.property('timeAfter:$1:$2:$3')
        .that.equals('Past Vacation Time must be greater than 2019-06-03 15:22:01 minus 4 years.');
    });
  });
});
