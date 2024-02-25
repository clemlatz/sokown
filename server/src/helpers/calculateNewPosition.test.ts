import calculateNewPosition from './calculateNewPosition';
import Position from '../models/Position';

describe('calculateNewPosition', () => {
  test('it calculates new position', () => {
    // given
    const startPosition = new Position(1, 1);
    const destinationPosition = new Position(3, 4);

    // when
    const newPosition = calculateNewPosition(
      startPosition,
      destinationPosition,
      100,
    );

    // then
    expect(newPosition.x).toBe(1.0003707937837683);
    expect(newPosition.y).toBe(1.0005561906756524);
  });

  test('it does not go further than destination', () => {
    // given
    const startPosition = new Position(10, 10);
    const destinationPosition = new Position(9, 9);

    // when
    const newPosition = calculateNewPosition(
      startPosition,
      destinationPosition,
      500000,
    );

    // then
    expect(newPosition.x).toBe(9);
    expect(newPosition.y).toBe(9);
  });
});
