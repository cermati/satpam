'use strict';

var expect = require('chai').expect;
var moment = require('moment');
var validator = require('../');

describe('Date validator', function () {
  context('given a date-after rule with parameter `now`', function () {
    var simpleRules = {
      vacationDate: ['date-after:DD/MM/YYYY:now']
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
      expect(err.vacationDate['date-after:$1:$2']).to.equal('Vacation Date must greater than now.');
    });
  });

  context('given a date-after rule with parameter 01-2014', function () {
    var simpleRules = {
      vacationDate: ['date-after:MM-YYYY:01-2014']
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
      expect(err.vacationDate['date-after:$1:$2']).to.equal('Vacation Date must greater than 01-2014.');
    });
  });
});
