import { expect } from 'chai';
import satpam from '../../lib';

describe('Validator._createRuleObject()', () => {
  const validator = satpam.create();

  context('when the given rule is an object', () => {
    context('and it has no rule parameters', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject({
          name: 'wut'
        });

        expect(ruleObj.name).to.equal('wut');
        expect(ruleObj.fullName).to.equal('wut');
        expect(ruleObj.params).to.deep.equal([]);
        expect(ruleObj.shouldValidate).to.be.a.function;
        expect(ruleObj.shouldValidate()).to.be.true;
      });
    });

    context('and it has one rule parameter', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject({
          name: 'this',
          params: ['is smelll']
        });

        expect(ruleObj.name).to.equal('this');
        expect(ruleObj.fullName).to.equal('this:$1');
        expect(ruleObj.params).to.deep.equal(['is smelll']);
        expect(ruleObj.shouldValidate).to.be.a.function;
        expect(ruleObj.shouldValidate()).to.be.true;
      });
    });

    context('and it has two rule parameters', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject({
          name: 'woosah',
          params: ['rocky', 'balboa']
        });

        expect(ruleObj.name).to.equal('woosah');
        expect(ruleObj.fullName).to.equal('woosah:$1:$2');
        expect(ruleObj.params).to.deep.equal(['rocky', 'balboa']);
        expect(ruleObj.shouldValidate).to.be.a.function;
        expect(ruleObj.shouldValidate()).to.be.true;
      });
    });
  });

  context('when the given rule is a string', () => {
    context('and it has no rule parameters', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject('minions');


        expect(ruleObj.name).to.equal('minions');
        expect(ruleObj.fullName).to.equal('minions');
        expect(ruleObj.params).to.deep.equal([]);
        expect(ruleObj.shouldValidate).to.be.a.function;
        expect(ruleObj.shouldValidate()).to.be.true;
      });
    });

    context('and it has one rule parameter', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject('minions:banana');

        expect(ruleObj.name).to.equal('minions');
        expect(ruleObj.fullName).to.equal('minions:$1');
        expect(ruleObj.params).to.deep.equal(['banana']);
        expect(ruleObj.shouldValidate).to.be.a.function;
        expect(ruleObj.shouldValidate()).to.be.true;
      });
    });

    context('and it has two rule parameters', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject('minions:banana:hulala');

        expect(ruleObj.name).to.equal('minions');
        expect(ruleObj.fullName).to.equal('minions:$1:$2');
        expect(ruleObj.params).to.deep.equal(['banana', 'hulala']);
        expect(ruleObj.shouldValidate).to.be.a.function;
        expect(ruleObj.shouldValidate()).to.be.true;
      });
    });
  });

  context('when shouldValidate property is passed', () => {
    context('and it\'s a conjunction object', () => {
      it('should create shouldValidate function', () => {
        const ruleObj = validator._createRuleObject({
          name: 'woosah',
          params: ['rocky', 'balboa'],
          shouldValidate: {
            type: 'and',
            mappings: {
              foo: {
                '!==': 'validate-me'
              }
            }
          }
        });

        expect(ruleObj.name).to.equal('woosah');
        expect(ruleObj.fullName).to.equal('woosah:$1:$2');
        expect(ruleObj.params).to.deep.equal(['rocky', 'balboa']);
        expect(ruleObj.shouldValidate).to.be.a.function;
        expect(ruleObj.shouldValidate(ruleObj, {
          foo: 'validate-me'
        })).to.be.false;
        expect(ruleObj.shouldValidate(ruleObj, {
          foo: 'validate-mee'
        })).to.be.true;
      });
    });
  });
});

