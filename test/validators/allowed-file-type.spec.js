import { expect } from 'chai';
import fs from 'fs';
import satpam from '../../lib';

const isoBmff = brand => {
  const buffer = Buffer.alloc(128);
  buffer.writeUInt32BE(32, 0);
  buffer.write(`ftyp${brand}`, 4, 'latin1');
  return buffer;
};

const BUFFER = {
  jpeg: fs.readFileSync('test/fixtures/dummyimg.jpeg'),
  pdf: fs.readFileSync('test/fixtures/sample.pdf'),
  // A real 1x1 png: file-type validates the IHDR chunk, so the 8-byte signature alone is not enough
  png: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADElEQVQI12NgYGAAAAAEAAEnNCcKAAAAAElFTkSuQmCC', 'base64'),
  mp4: isoBmff('isom'),
  php: Buffer.from('<?php system($_GET["c"]); ?>'),
  svg: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
  csv: Buffer.from('orderId,amount\nORD-1,1000\n')
};

const rulesFor = allowedMimeTypes => ({
  document: [{ name: 'allowedFileType', params: [allowedMimeTypes] }]
});

const IMAGE_RULES = rulesFor(['image/jpeg', 'image/png']);

describe('AllowedFileType Validator', () => {
  it('should pass a buffer whose content is an allowed type', async () => {
    for (const name of ['jpeg', 'png']) {
      const result = await satpam.validateAsync(IMAGE_RULES, { document: BUFFER[name] });

      expect(result.success, name).to.equal(true);
    }
  });

  it('should read the buffer off a multer-style file object', async () => {
    const result = await satpam.validateAsync(IMAGE_RULES, {
      document: { buffer: BUFFER.png, originalname: 'selfie.png' }
    });

    expect(result.success).to.equal(true);
  });

  it('should fail an identifiable type outside the list', async () => {
    const result = await satpam.validateAsync(IMAGE_RULES, { document: BUFFER.pdf });

    expect(result.success).to.equal(false);
    expect(result.messages.document['allowedFileType:$1']).to.equal('Document is not an allowed file type.');
  });

  it('should fail a script payload whatever its file name says', async () => {
    for (const name of ['php', 'svg']) {
      const result = await satpam.validateAsync(IMAGE_RULES, {
        document: { buffer: BUFFER[name], originalname: 'photo.jpg', mimetype: 'image/jpeg' }
      });

      expect(result.success, name).to.equal(false);
    }
  });

  it('should only pass unidentifiable content when null is allowed', async () => {
    const withoutNull = await satpam.validateAsync(rulesFor(['application/pdf']), { document: BUFFER.csv });
    const withNull = await satpam.validateAsync(rulesFor(['application/pdf', null]), { document: BUFFER.csv });

    expect(withoutNull.success).to.equal(false);
    expect(withNull.success).to.equal(true);
  });

  it('should identify an mp4 container', async () => {
    const result = await satpam.validateAsync(rulesFor(['video/mp4']), { document: BUFFER.mp4 });

    expect(result.success).to.equal(true);
  });

  it('should accept a single mime type from the string rule form', async () => {
    const result = await satpam.validateAsync({ document: ['allowedFileType:application/pdf'] }, { document: BUFFER.pdf });

    expect(result.success).to.equal(true);
  });

  it('should fail an object that carries no buffer', async () => {
    const result = await satpam.validateAsync(IMAGE_RULES, { document: { path: '/tmp/x.png' } });

    expect(result.success).to.equal(false);
  });

  it('should leave a missing value to the required rule', async () => {
    const optional = await satpam.validateAsync(IMAGE_RULES, {});
    const required = await satpam.validateAsync(
      { document: ['required', { name: 'allowedFileType', params: [['image/png']] }] },
      {}
    );

    expect(optional.success).to.equal(true);
    expect(required.success).to.equal(false);
    expect(required.messages.document).to.have.property('required');
  });

  it('should throw when used through the sync validate', () => {
    expect(() => satpam.validate(IMAGE_RULES, { document: BUFFER.png }))
      .to.throw('allowedFileType:$1 is an async satpam validation rule');
  });
});