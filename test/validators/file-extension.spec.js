import { expect } from 'chai';
import satpam from '../../lib';

const rules = {
  document: [{ name: 'fileExtension', params: [['.csv', '.xlsx']] }]
};

describe('FileExtension Validator', () => {
  it('should pass an allowed extension given as a file name', () => {
    expect(satpam.validate(rules, { document: 'report.csv' }).success).to.equal(true);
  });

  it('should match case-insensitively on a multer-style file object', () => {
    expect(satpam.validate(rules, { document: { originalname: 'REPORT.XLSX' } }).success).to.equal(true);
  });

  it('should fail a disallowed or missing extension', () => {
    for (const name of ['report.csv.php', 'report', 'photo.png', '.csv']) {
      const result = satpam.validate(rules, { document: name });

      expect(result.success, name).to.equal(false);
    }
  });

  it('should list the allowed extensions in the message', () => {
    const result = satpam.validate(rules, { document: 'photo.png' });

    expect(result.messages.document['fileExtension:$1'])
      .to.equal('Document must have one of these extensions: .csv,.xlsx.');
  });

  it('should fail an object that carries no file name', () => {
    expect(satpam.validate(rules, { document: { buffer: Buffer.from('a') } }).success).to.equal(false);
  });

  it('should accept a single extension from the string rule form', () => {
    expect(satpam.validate({ document: ['fileExtension:.csv'] }, { document: 'a.csv' }).success).to.equal(true);
  });

  it('should leave a missing value to the required rule', () => {
    expect(satpam.validate(rules, {}).success).to.equal(true);
  });

  it('should fail a name that ends in a bare dot', () => {
    expect(satpam.validate(rules, { document: 'a.csv.' }).success).to.equal(false);
  });

  it('should only check the last extension', () => {
    // Documented limitation: the client picks the name, so this rule never stands alone
    expect(satpam.validate(rules, { document: 'a.php.csv' }).success).to.equal(true);
  });
});
