import Location from '../models/Location';
import Position from '../models/Position';
import { Injectable } from '@nestjs/common';

const spaceLocation = new Location('space', 'Space', new Position(0, 0));
const locations = [
  new Location('sun', 'Sun', new Position(0, 0)),
  new Location('earth', 'Earth', new Position(758, 653)),
  new Location('moon', 'Moon', new Position(759, 655)),
  new Location('mars', 'Mars', new Position(318, 931)),
];

@Injectable()
export default class LocationRepository {
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
