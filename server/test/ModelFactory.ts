import Ship from '../src/models/Ship';
import Position from '../src/models/Position';
import SpeedInKilometersPerSecond from '../src/values/SpeedInKilometersPerSecond';
import User from '../src/models/User';

export default class ModelFactory {
  public static createShip({
    id = 1,
    owner = new User(2, 'Eileen Collins'),
    name = 'Artémis',
    speed = 100,
    currentPosition = new Position(1, 1),
    destinationPosition = null,
  }: {
    id?: number;
    owner?: User;
    name?: string;
    speed?: number;
    currentPosition?: Position;
    destinationPosition?: Position | null;
  } = {}): Ship {
    return new Ship(
      id,
      owner,
      name,
      new SpeedInKilometersPerSecond(speed),
      currentPosition,
      destinationPosition,
    );
  }
}
