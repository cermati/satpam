import { expect } from 'chai';
import validator from '../../lib';

describe('Plain object validator', () => {
  const rules = {
    abTestingExperiment: ['plainObject']
  };

  it('should success when given empty object', () => {
    const result = validator.validate(rules, {abTestingExperiment: {}});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('abTestingExperiment');
  });

  it('should success when given non-empty object', () => {
    const result = validator.validate(rules, {abTestingExperiment: {a: 1}});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('abTestingExperiment');
  });

  it('should fail when given an array', () => {
    const result = validator.validate(rules, {abTestingExperiment: []});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('abTestingExperiment');
    expect(err.abTestingExperiment.plainObject).to.equal('Ab Testing Experiment is not a plain object.');
  });

  it('should fail when given a string', () => {
    const result = validator.validate(rules, {abTestingExperiment: ''});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('abTestingExperiment');
    expect(err.abTestingExperiment.plainObject).to.equal('Ab Testing Experiment is not a plain object.');
  });


  it('should fail when given an user defined class instance', () => {
    function Pet(name, gender) {
      this.name = name;
      this.gender = gender;
    }

    const myPet = new Pet('petname', 'MALE');
    const result = validator.validate(rules, {abTestingExperiment: myPet});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('abTestingExperiment');
    expect(err.abTestingExperiment.plainObject).to.equal('Ab Testing Experiment is not a plain object.');
  });
});
