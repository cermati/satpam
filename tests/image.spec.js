var expect = require('chai').expect;
var validator = require('../');

describe('Image Validator', function() {
  var rules = {
    imageInput: ['image']
  };

  it('should fail on non image type', function() {
    var result = validator.validate(rules, {
      imageInput: 'README.md'
    });

    expect(result.success).to.equals(false);
    expect(result.messages.imageInput.image).to.equals('Image Input must be an image.');
  });

  it('should success on image type', function() {
    var result = validator.validate(rules, {
      imageInput: 'tests/fixtures/dummyimg.jpeg'
    });

    expect(result.success).to.equals(true);
  });

  it('should fail on non image type (object input)', function() {
    var result = validator.validate(rules, {
      imageInput: {path: 'README.md'}
    });

    expect(result.success).to.equals(false);
    expect(result.messages.imageInput.image).to.equals('Image Input must be an image.');
  });

  it('should success on image type (object input)', function() {
    var result = validator.validate(rules, {
      imageInput: {path: 'tests/fixtures/dummyimg.jpeg'}
    });

    expect(result.success).to.equals(true);
  });
});
