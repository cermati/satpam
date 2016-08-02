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

        expect(ruleObj).to.deep.equal({
          name: 'wut',
          fullName: 'wut',
          params: []
        });
      });
    });

    context('and it has one rule parameter', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject({
          name: 'this',
          params: ['is smelll']
        });

        expect(ruleObj).to.deep.equal({
          name: 'this',
          fullName: 'this:$1',
          params: ['is smelll']
        });
      });
    });

    context('and it has two rule parameters', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject({
          name: 'woosah',
          params: ['rocky', 'balboa']
        });

        expect(ruleObj).to.deep.equal({
          name: 'woosah',
          fullName: 'woosah:$1:$2',
          params: ['rocky', 'balboa']
        });
      });
    });
  });

  context('when the given rule is a string', () => {
    context('and it has no rule parameters', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject('minions');

        expect(ruleObj).to.deep.equal({
          name: 'minions',
          fullName: 'minions',
          params: []
        });
      });
    });

    context('and it has one rule parameter', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject('minions:banana');

        expect(ruleObj).to.deep.equal({
          name: 'minions',
          fullName: 'minions:$1',
          params: ['banana']
        });
      });
    });

    context('and it has two rule parameters', () => {
      it('should create valid ruleObj', () => {
        const ruleObj = validator._createRuleObject('minions:banana:hulala');

        expect(ruleObj).to.deep.equal({
          name: 'minions',
          fullName: 'minions:$1:$2',
          params: ['banana', 'hulala']
        });
      });
    });
  });
});

