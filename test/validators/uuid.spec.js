import { expect } from 'chai';
import validator from '../../lib';

describe('UUID validator', () => {
  const rules = {
    id: ['uuid:all'],
    id1: ['uuid:v1'],
    id3: ['uuid:v3'],
    id4: ['uuid:v4'],
    id5: ['uuid:v5']
  };

  it('should fail if id is empty', () => {
    const result = validator.validate(rules, {
      id: ''
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id');
  });

  it('should fail if id is not valid uuid', () => {
    const result = validator.validate(rules, {
      id: 'YO WAT'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id');
  });

  it('should success if id is valid uuid', () => {
    const result = validator.validate(rules, {
      id: 'bb97d43f-1cb7-4d9f-84ab-5e9925238ff8'
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('id');
  });

  it('should success if id is valid uuid v1', () => {
    const result = validator.validate(rules, {
      id1: '2c1d43b8-e6d7-176e-af7f-d4bde997cc3f'
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('id1');
  });

  it('should fail if id is not valid uuid v1', () => {
    const result = validator.validate(rules, {
      id1: '2c1d43b8-e6d7-276e-af7f-d4bde997cc3f'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id1');
  });

  it('should success if id is valid uuid v3', () => {
    const result = validator.validate(rules, {
      id3: '2c1d43b8-e6d7-376e-af7f-d4bde997cc3f'
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('id3');
  });

  it('should fail if id is not valid uuid v3', () => {
    const result = validator.validate(rules, {
      id3: '2c1d43b8-e6d7-176e-af7f-d4bde997cc3f'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id3');
  });

  it('should success if id is valid uuid v4', () => {
    const result = validator.validate(rules, {
      id4: '0535708e-4b1e-4604-affa-52b4b4ebd2a9'
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('id4');
  });

  it('should fail if id is not valid uuid v4', () => {
    const result = validator.validate(rules, {
      id4: '0535708e-4b1e-3604-affa-52b4b4ebd2a9'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id4');
  });

  it('should fail if id is not valid uuid v4', () => {
    const result = validator.validate(rules, {
      id4: '0535708e-4b1e-4604-fffa-52b4b4ebd2a9'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id4');
  });

  it('should success if id is valid uuid v5', () => {
    const result = validator.validate(rules, {
      id5: '0535708e-4b1e-5604-affa-52b4b4ebd2a9'
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('id5');
  });

  it('should fail if id is not valid uuid v5', () => {
    const result = validator.validate(rules, {
      id5: '0535708e-4b1e-4604-affa-52b4b4ebd2a9'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id5');
  });

  it('should fail if id is not valid uuid v5', () => {
    const result = validator.validate(rules, {
      id5: '0535708e-4b1e-5604-fffa-52b4b4ebd2a9'
    });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('id5');
  });
});
