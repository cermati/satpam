import { expect } from 'chai';
import satpam from '../../lib';

const rules = { payload: ['json'] };

describe('Json Validator', () => {
  it('should pass JSON text, a buffer, or a file object', () => {
    const inputs = [
      '{"a":1}',
      Buffer.from('[{"package":"com.example"}]'),
      { buffer: Buffer.from('{"ok":true}') }
    ];

    inputs.forEach(payload => {
      expect(satpam.validate(rules, { payload }).success).to.equal(true);
    });
  });

  it('should fail anything that does not parse', () => {
    const inputs = [
      'not json',
      Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
      Buffer.alloc(0),
      { path: '/tmp/a.json' }
    ];

    inputs.forEach(payload => {
      const result = satpam.validate(rules, { payload });

      expect(result.success).to.equal(false);
      expect(result.messages.payload.json).to.equal('Payload must be valid JSON.');
    });
  });

  it('should leave a missing value to the required rule', () => {
    expect(satpam.validate(rules, {}).success).to.equal(true);
  });
});