import Location from '../models/Location';
import Position from '../models/Position';
import { Injectable } from '@nestjs/common';

const spaceLocation = new Location(
  'space',
  'Space',
  'black',
  new Position(0, 0),
);
const sun = new Location('sun', 'Sun', '#f8cb5d', new Position(0, 0));
const earth = new Location(
  'earth',
  'Earth',
  '#84c8e4',
  new Position(0, 0),
  sun,
);
const locations = [
  sun,
  new Location('mercury', 'Mercury', '#b89276', new Position(0, 0), sun),
  new Location('venus', 'Venus', '#ecc0bf', new Position(0, 0), sun),
  earth,
  new Location('moon', 'Moon', 'grey', new Position(0, 0), earth),
  new Location('mars', 'Mars', '#c84835', new Position(0, 0), sun),
];

@Injectable()
export default class LocationRepository {
  getAll(): Location[] {
    return locations;
  }

  getByCode(code: string): Location {
    const location = locations.find((location) => location.code === code);
    if (!location) {
      throw new Error(`Unknown location ${code}`);
    }

    return location;
  }

  findByPosition(position: Position): Location | null {
    const location = locations.find((location) => {
      return (
        location.position.x === position.x && location.position.y === position.y
      );
    });

    return location ?? spaceLocation;
  }
}
