import Location from '../models/Location';
import Position from '../models/Position';

const locations = [
  new Location('earth', 'Earth', new Position(1, 1)),
  new Location('moon', 'Moon', new Position(3, 3)),
  new Location('mars', 'Mars', new Position(23, 17)),
];

export default class LocationRepository {
  getByCode(code: string): Location {
    const location = locations.find((location) => location.code === code);
    if (!location) {
      throw new Error(`Unknown location ${code}`);
    }

    return location;
  }
}
