'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('regexp validator', function () {
  context('given value that matches the pattern non digit', function () {
    var rules = {
      name: ['regex:\\D:g']
    };
    var result = validator.validate(rules, {name: 'halo'});
    var err = result.messages;

    it('should success', function () {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  context('given value that does not match the pattern non digit', function () {
    var rules = {
      name: ['regex:\\D:g']
    };
    var result = validator.validate(rules, {name: '3'});
    var err = result.messages;

    it('should fail', function () {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });


    it('should have correct validation message', function () {
      expect(err.name['regex:$1:$2']).to.equal('Name does not conform pattern \\D.');
    });
  });

  context('given value that matches the pattern "(alo){3}$"', function () {
    var rules = {
      name: ['regex:(alo){3}$:g']
    };
    var result = validator.validate(rules, {name: 'haloaloalo'});
    var err = result.messages;

    it('should fail', function () {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  context('given value that does not match the pattern "(alo){3}$"', function () {
    var rules = {
      name: ['regex:(alo){3}$:g']
    };
    var result = validator.validate(rules, {name: 'haloalo'});
    var err = result.messages;

    it('should fail', function () {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
    });

    it('should have correct validation message', function () {
      expect(err.name['regex:$1:$2']).to.equal('Name does not conform pattern (alo){3}$.');
    });
  });
});

