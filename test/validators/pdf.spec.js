import { expect } from 'chai';
import validator from '../../lib';

describe('Pdf Validator', () => {
  const rules = {
    pdfInput: ['pdf']
  };

  it('should fail on non pdf type', () => {
    const result = validator.validate(rules, {
      pdfInput: 'README.md'
    });

    expect(result.success).to.equal(false);
    expect(result.messages.pdfInput.pdf).to.equal('pdf Input must be an pdf.');
  });

  it('should success on pdf type', () => {
    const result = validator.validate(rules, {
      pdfInput: 'test/fixtures/sample.pdf'
    });

    expect(result.success).to.equal(true);
  });

  it('should fail on non pdf type (object input)', () => {
    const result = validator.validate(rules, {
      pdfInput: {path: 'README.md'}
    });

    expect(result.success).to.equal(false);
    expect(result.messages.pdfInput.pdf).to.equal('pdf Input must be an pdf.');
  });

  it('should success on pdf type (object input)', () => {
    const result = validator.validate(rules, {
      pdfInput: {path: 'test/fixtures/sample.pdf'}
    });

    expect(result.success).to.equal(true);
  });
});

