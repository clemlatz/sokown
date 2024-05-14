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

  describe('roundedX / roundedX', () => {
    test('it returns coordinates rounded to two digits', () => {
      // given
      const position = new Position(3.1415, 1.618);

      // when
      const roundedX = position.roundedX;
      const roundedY = position.roundedY;

      // then
      expect(roundedX).toEqual(3.14);
      expect(roundedY).toEqual(1.62);
    });
  });
});
