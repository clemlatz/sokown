import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';
import Position from '../models/Position';

describe('calculateDistanceBetweenPosition', () => {
  test('it calculates distance between two position2', () => {
    // given
    const position1 = new Position(1, 1);
    const position2 = new Position(3, 4);

    // when
    const distance = calculateDistanceBetweenPositions(position1, position2);

    // then
    expect(distance).toBe(3.605551275463989);
  });
});
