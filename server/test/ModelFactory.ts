import Ship from '../src/models/Ship';
import Position from '../src/models/Position';

export default class ModelFactory {
  public static createShip({
    id = 1,
    name = 'Artémis',
    currentPosition = new Position(1, 1),
    destinationPosition = null,
  }): Ship {
    return new Ship(id, name, currentPosition, destinationPosition);
  }
}
