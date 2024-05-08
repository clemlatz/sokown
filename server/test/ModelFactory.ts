import Ship from '../src/models/Ship';
import Position from '../src/models/Position';
import Location from '../src/models/Location';
import User from '../src/models/User';
import AuthenticationMethod from '../src/models/AuthenticationMethod';
import SpeedInKilometersPerSecond from '../src/values/SpeedInKilometersPerSecond';
import DistanceInSokownUnits from '../src/values/DistanceInSokownUnits';

export default class ModelFactory {
  public static createAuthenticationMethod({
    id = 1,
    idTokenClaims = {
      email: 'user@example.net',
      username: 'name',
    },
    user = null,
  }) {
    return new AuthenticationMethod(id, idTokenClaims, user);
  }

  public static createShip({
    id = 1,
    owner = new User(2, 'Eileen Collins'),
    name = 'Artémis',
    speed = 100,
    currentPosition = new Position(1, 1),
    destinationPosition = null,
    currentLocationCode = null,
  }: {
    id?: number;
    owner?: User;
    name?: string;
    speed?: number;
    currentPosition?: Position;
    destinationPosition?: Position | null;
    currentLocationCode?: string | null;
  } = {}): Ship {
    return new Ship(
      id,
      owner,
      name,
      new SpeedInKilometersPerSecond(speed),
      currentPosition,
      destinationPosition,
      currentLocationCode,
    );
  }

  public static createLocation({
    code = 'earth',
    name = 'Earth',
    position = new Position(3, 4),
    primaryBody = null,
    distanceFromPrimaryBody: orbitRadius = 5,
  }) {
    const location = new Location(code, name, position, primaryBody);
    location.distanceFromPrimaryBody = new DistanceInSokownUnits(orbitRadius);
    return location;
  }
}
