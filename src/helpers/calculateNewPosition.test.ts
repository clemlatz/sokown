import calculateNewPosition from "./calculateNewPosition";
import Position from "../models/Position";

describe('calculateNewPosition', () => {
  test('it calculates new position', () => {
    // given
    const startPosition = new Position(1,1);
    const destinationPosition = new Position(3,4);

    // when
    const newPosition = calculateNewPosition(startPosition, destinationPosition, 1);

    // then
    expect(newPosition.x).toBe( 1.5547001962252291);
    expect(newPosition.y).toBe(1.8320502943378436);
  });

  test('it does not go further than destination', () => {
    // given
    const startPosition = new Position(10,10);
    const destinationPosition = new Position(9,9);

    // when
    const newPosition = calculateNewPosition(startPosition, destinationPosition, 5);

    // then
    expect(newPosition.x).toBe( 9);
    expect(newPosition.y).toBe(9);
  });
});
