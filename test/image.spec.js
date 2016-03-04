import { expect } from 'chai';
import validator from '../lib';

describe('Image Validator', () => {
  const rules = {
    imageInput: ['image']
  };

  it('should fail on non image type', () => {
    const result = validator.validate(rules, {
      imageInput: 'README.md'
    });

    expect(result.success).to.equal(false);
    expect(result.messages.imageInput.image).to.equal('Image Input must be an image.');
  });

  it('should success on image type', () => {
    const result = validator.validate(rules, {
      imageInput: 'test/fixtures/dummyimg.jpeg'
    });

    expect(result.success).to.equal(true);
  });

  it('should fail on non image type (object input)', () => {
    const result = validator.validate(rules, {
      imageInput: {path: 'README.md'}
    });

    expect(result.success).to.equal(false);
    expect(result.messages.imageInput.image).to.equal('Image Input must be an image.');
  });

  it('should success on image type (object input)', () => {
    const result = validator.validate(rules, {
      imageInput: {path: 'test/fixtures/dummyimg.jpeg'}
    });

    expect(result.success).to.equal(true);
  });
});
