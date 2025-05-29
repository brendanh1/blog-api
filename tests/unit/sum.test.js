const sum = require('../../src/utils/sum');

describe('sum utility', () => {
  it('should return correct sum', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
