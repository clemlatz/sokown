import Position from './Position';

describe('Position', () => {
  test('it prints position', () => {
    // given
    const position = new Position(1, 2);

    // when
    const string = position.toString();

    // then
    expect(string).toBe('{1,2}');
  });
});
