import Ship from '../src/models/Ship';
import Position from '../src/models/Position';
import SpeedInKilometersPerSecond from '../src/values/SpeedInKilometersPerSecond';

export default class ModelFactory {
  public static createShip({
    id = 1,
    name = 'Artémis',
    speed = 100,
    currentPosition = new Position(1, 1),
    destinationPosition = null,
  }: {
    id?: number;
    name?: string;
    speed?: number;
    currentPosition?: Position;
    destinationPosition?: Position | null;
  } = {}): Ship {
    return new Ship(
      id,
      name,
      new SpeedInKilometersPerSecond(speed),
      currentPosition,
      destinationPosition,
    );
  }
}
