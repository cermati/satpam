import { expect } from 'chai';
import fs from 'fs';
import validator from '../../lib';

describe('FileType Validator', () => {
  const rules = {
    pdfInput: ['fileType:pdf']
  };

  it('should fail on non pdf type', () => {
    const result = validator.validate(rules, {
      pdfInput: 'README.md'
    });

    expect(result.success).to.equal(false);
    expect(result.messages.pdfInput['fileType:$1']).to.equal('Pdf Input must be a(n) pdf.');
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
    expect(result.messages.pdfInput['fileType:$1']).to.equal('Pdf Input must be a(n) pdf.');
  });

  it('should success on pdf type (object input)', () => {
    const result = validator.validate(rules, {
      pdfInput: {path: 'test/fixtures/sample.pdf'}
    });

    expect(result.success).to.equal(true);
  });

  it('should success on buffer type', () => {
    const buffer = fs.readFileSync('test/fixtures/sample.pdf');
    const result = validator.validate(rules, {
      pdfInput: buffer
    });

    expect(result.success).to.equal(true);
  });
});

