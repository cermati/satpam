'use strict';

var expect = require('chai').expect;
var moment = require('moment');
var validator = require('../');

describe('Date validator', function () {
  context('given a dateBefore rule with parameter `now`', function () {
    var simpleRules = {
      pastVacationDate: ['dateBefore:DD/MM/YYYY:now']
    };

    var getTestObject = function () {
      var pastDate = moment().subtract(1, 'day').format('DD/MM/YYYY');

      return {
        pastVacationDate: pastDate,
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
        pastVacationDate: moment().format('DD/MM/YYYY')
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationDate');
      expect(err.pastVacationDate).to.have.property('dateBefore:$1:$2')
        .that.equals('Past Vacation Date must less than now.');
    });
  });

  context('given a dateBefore rule with parameter 01-2014', function () {
    var simpleRules = {
      pastVacationDate: ['dateBefore:MM-YYYY:01-2014']
    };

    var getTestObject = function () {
      var pastDate = moment('12-2013', 'MM-YYYY');

      return {
        pastVacationDate: pastDate,
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pastVacationDate');
    });

    it('should fail when input has the same month', function () {
      var result = validator.validate(simpleRules, {
        pastVacationDate: moment('01-2014', 'MM-YYYY')
      });
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pastVacationDate');
      expect(err.pastVacationDate).to.have.property('dateBefore:$1:$2')
        .that.equals('Past Vacation Date must less than 01-2014.');
    });
  });
});

