import { HyperJudge } from '../HyperJudge';

describe('HyperJudge', () => {
  let judge;

  beforeEach(() => {
    judge = new HyperJudge();
  });

  test('should correctly identify 五光 (Goko) role', () => {
    const pairedCards = [
      { name: '松', type: '光' },
      { name: '桜', type: '光' },
      { name: '芒', type: '光' },
      { name: '柳', type: '光' },
      { name: '桐', type: '光' },
    ];
    const roles = judge.calculateRoles(pairedCards);
    expect(roles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: '五光', points: 15 }),
      ])
    );
  });

  test('should return empty array if no roles are found', () => {
    const pairedCards = [
      { name: 'カス1', type: 'カス' },
      { name: 'カス2', type: 'カス' },
    ];
    const roles = judge.calculateRoles(pairedCards);
    expect(roles).toEqual([]);
  });

});