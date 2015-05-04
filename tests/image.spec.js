var expect = require('chai').expect;
var validator = require('../');

describe('Image Validator', function() {
  var rules = {
    imageInput: ['image']
  };

  it('Should fail on non image type', function() {
    var result = validator.validate(rules, {
      imageInput: 'README.md'
    });

    expect(result.success).to.equals(false);
    expect(result.messages.imageInput.image).to.equals('Image Input must be an image.');
  });

  it('Should success on image type', function() {
    var result = validator.validate(rules, {
      imageInput: 'tests/fixtures/dummyimg.jpeg'
    });

    expect(result.success).to.equals(true);
  });
});
