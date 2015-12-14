'use strict';

var expect = require('chai').expect;
var moment = require('moment');
var validator = require('../');

describe('Date validator', function () {
  context('given a date-after rule with parameter `now`', function () {
    var simpleRules = {
      vacationDate: ['date-after:now']
    };

    var getTestObject = function () {
      var tomorrowDate = moment().add(1, 'day').format('DD-MM-YYYY');

      return {
        vacationDate: tomorrowDate,
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('vacationDate');
    });
  });
});
