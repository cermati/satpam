import { expect } from 'chai';
import dayjs from 'dayjs';
import validator from '../../lib';

describe('Time Before validator', () => {
  context('given a timeBefore rule with parameter `now`', () => {
    const rules = {
      vacationTime: ['timeBefore:now:0:minutes']
    };

    const getTestObject = () => {
      const pastTime = dayjs().subtract(1, 'seconds');

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

    it('should fail when input has the same time or slightly more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: dayjs()
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Vacation Time must be less than now.');
    });
  });

  context('given a timeBefore rule with parameter `2019-06-03 15:22:01` in unix', () => {
    const rules = {
      vacationTime: ['timeBefore:1559550121:0:minutes']
    };

    const getTestObject = () => {
      const pastTime = dayjs('2019-06-03T08:22:00Z');

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

    it('should fail when input has the same time', () => {
      const result = validator.validate(rules, {
        vacationTime: dayjs('2019-06-03T08:22:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Vacation Time must be less than 2019-06-03 15:22:01+07:00.');
    });
  });

  context('given a timeBefore rule with parameter `now` and -30 minutes', () => {
    const rules = {
      vacationTime: ['timeBefore:now:-30:minutes']
    };

    const getTestObject = () => {
      const time = dayjs().subtract(30, 'minutes').subtract(1, 'seconds');

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

    it('should fail when input has the same time or slightly more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: dayjs().subtract(30, 'minutes').add(1, 'second'),
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Vacation Time must be less than now minus 30 minutes.');
    });
  });

  context('given a timeBefore rule with parameter `now` and 30 seconds', () => {
    const rules = {
      vacationTime: ['timeBefore:now:30:seconds']
    };

    const getTestObject = () => {
      const time = dayjs().add(29, 'seconds');

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

    it('should fail when input has the same time or slightly more recent time', () => {
      const result = validator.validate(rules, {
        vacationTime: dayjs().add(30, 'seconds').add(1, 'second'),
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Vacation Time must be less than now plus 30 seconds.');
    });
  });

  context('given a dateAfter rule with parameter `2019-06-03 15:22:01` in unix and -10 minutes', () => {
    const rules = {
      vacationTime: ['timeBefore:1559550121:-10:minutes']
    };

    const getTestObject = () => {
      return {
        vacationTime: dayjs('2019-06-03T08:12:00Z')
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
        vacationTime: dayjs('2019-06-03T08:12:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Vacation Time must be less than 2019-06-03 15:22:01+07:00 minus 10 minutes.');
    });
  });

  context('given a timeBefore rule with parameter `2019-06-03 15:22:01` in unix and 10 seconds', () => {
    const rules = {
      vacationTime: ['timeBefore:1559550121:10:seconds']
    };

    const getTestObject = () => {
      return {
        vacationTime: dayjs('2019-06-03T08:22:09Z')
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
        vacationTime: dayjs('2019-06-03T08:22:11Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationTime');
      expect(err.vacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Vacation Time must be less than 2019-06-03 15:22:01+07:00 plus 10 seconds.');
    });
  });

  context('given a timeBefore rule with parameter `2019-06-03 15:22:01` in unix and 5 hours', () => {
    const rules = {
      pastVacationTime: ['timeBefore:1559550121:5:hours']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: dayjs('2019-06-03T13:22:00Z')
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
        pastVacationTime: dayjs('2019-06-03T13:22:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationTime');
      expect(err.pastVacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Past Vacation Time must be less than 2019-06-03 15:22:01+07:00 plus 5 hours.');
    });
  });

  context('given a timeBefore rule with parameter `2019-06-03 15:22:01` and -4 years', () => {
    const rules = {
      pastVacationTime: ['timeBefore:1559550121:-4:years']
    };

    const getTestObject = () => {
      return {
        pastVacationTime: dayjs('2015-06-03T08:22:00Z')
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
        pastVacationTime: dayjs('2015-06-03T08:22:01Z')
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationTime');
      expect(err.pastVacationTime).to.have.property('timeBefore:$1:$2:$3')
        .that.equals('Past Vacation Time must be less than 2019-06-03 15:22:01+07:00 minus 4 years.');
    });
  });
});
