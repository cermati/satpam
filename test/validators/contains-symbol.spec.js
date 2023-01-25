import { expect } from 'chai';
import validator from '../../lib';

describe('Contains symbol validator', () => {
  const rules = {
    someField: ['containsSymbol']
  };

  const chars = '~`! @#$%^&*()_-+={[}]|\\:;"\'<,>.?/';

  for (const c of chars) {
    it('should success with symbol input value ' + c, () => {
      const password = 'pass' + c + 'word';
      const result = validator.validate(rules, {someField: password});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('someField');
    });
  }


  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 'bozz'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField.containsSymbol).to.equal('Some Field must contain at least 1 symbol.');
  });
});
