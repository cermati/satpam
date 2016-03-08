import { expect } from 'chai';
import validator from '../../lib';

describe('Mongo ID validator', () => {
  const rules = {
    id: ['mongoId']
  };

  it('should success if id is falsy', () => {
    const result = validator.validate(rules, {
      id: '',
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('id');
  });

  it('should success with valid object id', () => {
    const result = validator.validate(rules, {
      id: '56dd5bef2ff08635af2b1950'
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('id');
  });

  it('should fail with invalid object id', () => {
    const result = validator.validate(rules, {
      id: '56dd5bef2ff08635af2bz950'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id');
    expect(err.id.mongoId).to.equal('Id field is not a valid Mongo ID.');
  });
});
