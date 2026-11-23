import { expect } from 'chai';
import satpam from '../../lib';

const delay = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms));

describe('Validator.validateAsync()', () => {
  // An isolated instance, so these test-only rules do not leak into the global rule set
  const validator = satpam.create();

  validator.addCustomValidation('asyncPass', () => delay(5, true));
  validator.addCustomValidation('asyncFail', () => delay(5, false));

  // Settles after `asyncFail`, so a test can tell completion order from rule order
  validator.addCustomValidation('slowFail', () => delay(20, false));
  validator.addCustomValidation('asyncReject', () => Promise.reject(new Error('boom')));
  validator.setValidationMessage('asyncFail', '<%= propertyName %> failed async.');
  validator.setValidationMessage('slowFail', '<%= propertyName %> failed slowly.');

  context('with sync rules only', () => {
    const cases = [
      {
        description: 'all passing',
        rules: { name: ['required'], email: ['required', 'email'] },
        input: { name: 'matthew', email: 'matthew@example.com' }
      },
      {
        description: 'several failing',
        rules: { name: ['required'], email: ['required', 'email'] },
        input: { name: '', email: 'not-an-email' }
      },
      {
        description: 'an any-of group that fails',
        rules: { document: ['required', ['fileType:pdf', 'image']] },
        input: { document: 'README.md' }
      },
      {
        description: 'a nested mapping',
        rules: { address: { city: ['required'], zip: ['numeric'] } },
        input: { address: { city: '', zip: 'abc' } }
      }
    ];

    cases.forEach(({ description, rules, input }) => {
      it(`should match validate() for ${description}`, async () => {
        const expected = satpam.validate(rules, input);
        const actual = await satpam.validateAsync(rules, input);

        expect(actual).to.deep.equal(expected);
      });
    });
  });

  context('with async rules', () => {
    it('should pass when the async rule resolves true', async () => {
      const result = await validator.validateAsync({ name: ['required', 'asyncPass'] }, { name: 'x' });

      expect(result.success).to.equal(true);
      expect(result.messages).to.not.have.property('name');
    });

    it('should fail with the rule message when the async rule resolves false', async () => {
      const result = await validator.validateAsync({ name: ['asyncFail'] }, { name: 'x' });

      expect(result.success).to.equal(false);
      expect(result.messages.name.asyncFail).to.equal('Name failed async.');
    });

    it('should pass an any-of group when one async rule passes', async () => {
      const result = await validator.validateAsync({ name: [['asyncFail', 'asyncPass']] }, { name: 'x' });

      expect(result.success).to.equal(true);
    });

    it('should report every rule of an any-of group when all of them fail', async () => {
      const result = await validator.validateAsync({ name: [['asyncFail', 'slowFail']] }, { name: 'x' });

      expect(result.success).to.equal(false);
      expect(result.messages.name).to.have.all.keys('asyncFail', 'slowFail');
    });

    it('should set messages in rule order, not completion order', async () => {
      const result = await validator.validateAsync({ name: ['slowFail', 'asyncFail'] }, { name: 'x' });

      expect(Object.keys(result.messages.name)).to.deep.equal(['slowFail', 'asyncFail']);
    });

    it('should validate nested mappings', async () => {
      const result = await validator.validateAsync(
        { profile: { name: ['asyncFail'] } },
        { profile: { name: 'x' } }
      );

      expect(result.success).to.equal(false);
      expect(result.messages.profile.name.asyncFail).to.equal('Name failed async.');
    });

    it('should skip an async rule whose shouldValidate is false', async () => {
      const result = await validator.validateAsync(
        { name: [{ name: 'asyncFail', shouldValidate: () => false }] },
        { name: 'x' }
      );

      expect(result.success).to.equal(true);
    });

    it('should reject when an async rule rejects', async () => {
      let error;

      try {
        await validator.validateAsync({ name: ['asyncReject'] }, { name: 'x' });
      } catch (err) {
        error = err;
      }

      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('boom');
    });

    it('should reject an any-of group when one rule rejects, even if another passes', async () => {
      let error;

      try {
        await validator.validateAsync({ name: [['asyncPass', 'asyncReject']] }, { name: 'x' });
      } catch (err) {
        error = err;
      }

      // A rejection means the rule could not run, so a passing sibling does not outvote it
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('boom');
    });
  });

  context('validate() given an async rule', () => {
    it('should throw instead of silently passing', () => {
      expect(() => validator.validate({ name: ['asyncFail'] }, { name: 'x' }))
        .to.throw('asyncFail is an async satpam validation rule, use validateAsync instead of validate.');
    });

    it('should throw for an async rule inside an any-of group', () => {
      expect(() => validator.validate({ name: [['required', 'asyncPass']] }, { name: 'x' }))
        .to.throw('asyncPass is an async satpam validation rule');
    });

    it('should throw for an async rule inside a nested mapping', () => {
      expect(() => validator.validate({ profile: { name: ['asyncPass'] } }, { profile: { name: 'x' } }))
        .to.throw('asyncPass is an async satpam validation rule');
    });
  });
});
