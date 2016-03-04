'use strict';

var expect = require('chai').expect;
var moment = require('moment');
var validator = require('../');

describe('Date After validator', function () {
  context('given a dateAfter rule with parameter `now`', function () {
    var simpleRules = {
      vacationDate: ['dateAfter:DD/MM/YYYY:now:0:days']
    };

    var getTestObject = function () {
      var futureDate = moment().add(1, 'day').format('DD/MM/YYYY');

      return {
        vacationDate: futureDate,
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same date', function () {
      var result = validator.validate(simpleRules, {
        vacationDate: moment().format('DD/MM/YYYY')
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than now.');
    });
  });

  context('given a dateAfter rule with parameter 01-2014', function () {
    var simpleRules = {
      vacationDate: ['dateAfter:MM-YYYY:01-2014:0:days']
    };

    var getTestObject = function () {
      var futureDate = moment('02-2014', 'MM-YYYY');

      return {
        vacationDate: futureDate,
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same month', function () {
      var result = validator.validate(simpleRules, {
        vacationDate: moment('01-2014', 'MM-YYYY')
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than 01-2014.');
    });
  });

  context('given a dateAfter rule with parameter `now` and -365 days', function () {
    var simpleRules = {
      vacationDate: ['dateAfter:DD/MM/YYYY:now:-365:days']
    };

    var getTestObject = function () {
      var date = moment().subtract(364, 'days').format('DD/MM/YYYY');

      return {
        vacationDate: date,
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same date', function () {
      var result = validator.validate(simpleRules, {
        vacationDate: moment().subtract(365, 'days').format('DD/MM/YYYY')
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than now minus 365 days.');
    });
  });

  context('given a dateAfter rule with parameter `now` and 40 days', function () {
    var simpleRules = {
      vacationDate: ['dateAfter:DD/MM/YYYY:now:40:days']
    };

    var getTestObject = function () {
      var date = moment().add(41, 'days').format('DD/MM/YYYY');

      return {
        vacationDate: date,
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same date', function () {
      var result = validator.validate(simpleRules, {
        vacationDate: moment().add(40, 'days').format('DD/MM/YYYY')
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than now plus 40 days.');
    });
  });

  context('given a dateAfter rule with parameter `02-09` and -10 days', function () {
    var simpleRules = {
      vacationDate: ['dateAfter:DD-MM:02-09:-10:days']
    };

    var getTestObject = function () {
      return {
        vacationDate: '24-08',
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same date', function () {
      var result = validator.validate(simpleRules, {
        vacationDate: '23-08'
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than 02-09 minus 10 days.');
    });
  });

  context('given a dateAfter rule with parameter `12-09` and 10 days', function () {
    var simpleRules = {
      vacationDate: ['dateAfter:DD-MM:12-09:10:days']
    };

    var getTestObject = function () {
      return {
        vacationDate: '23-09',
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });

    it('should fail when input has the same date', function () {
      var result = validator.validate(simpleRules, {
        vacationDate: '22-09'
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('vacationDate');
      expect(err.vacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Vacation Date must greater than 12-09 plus 10 days.');
    });
  });

  context('given a dateAfter rule with parameter `12-09` and 3 months', function () {
    var simpleRules = {
      pastVacationDate: ['dateAfter:DD-MM:12-09:3:months']
    };

    var getTestObject = function () {
      return {
        pastVacationDate: '13-12',
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should fail when input has the same date', function () {
      var result = validator.validate(simpleRules, {
        pastVacationDate: '12-12'
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationDate');
      expect(err.pastVacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Past Vacation Date must greater than 12-09 plus 3 months.');
    });
  });

  context('given a dateAfter rule with parameter `04-06-2015` and -4 years', function () {
    var simpleRules = {
      pastVacationDate: ['dateAfter:DD-MM-YYYY:04-06-2015:-4:years']
    };

    var getTestObject = function () {
      return {
        pastVacationDate: '05-06-2011',
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should fail when input has the same date', function () {
      var result = validator.validate(simpleRules, {
        pastVacationDate: '04-06-2011'
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationDate');
      expect(err.pastVacationDate).to.have.property('dateAfter:$1:$2:$3:$4')
        .that.equals('Past Vacation Date must greater than 04-06-2015 minus 4 years.');
    });
  });
});

