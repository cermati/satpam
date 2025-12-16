import { expect } from 'chai';
import validator from '../../lib';

describe('MustInclude validator', () => {
  const objectRules = {
    item: [
      {
        name: 'mustInclude', params: [['A', 'C']]
      }
    ]
  };

  it('should success if inputs have the required items', () => {
    const acceptedInputs = [
      ['A', 'C'],
      ['A', 'B', 'C']
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(objectRules, {item: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('item');
    });
  });

  it('should fail if inputs only have some of the required items', () => {
    const rejectedInputs = [
      ['A', 'B'],
      ['A', 'B', 'D'],
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {item: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('item');
      expect(err.item['mustInclude:$1']).to.equal('Item must include all of A,C.');
    });
  });

  it('should fail if inputs have none of the required items', () => {
    const rejectedInputs = [
      'B',
      ['B', 'D'],
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(objectRules, {item: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('item');
      expect(err.item['mustInclude:$1']).to.equal('Item must include all of A,C.');
    });
  });

});
