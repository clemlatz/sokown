import Location from '../models/Location';
import Position from '../models/Position';
import { Injectable } from '@nestjs/common';
import isPositionWithinTolerance from '../helpers/isPositionWithinTolerance';
import calculateDistanceBetweenPositions from '../helpers/calculateDistanceBetweenPositions';

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
    // Find all locations within tolerance
    const locationsWithinTolerance = locations.filter((location) => {
      return isPositionWithinTolerance(position, location.position);
    });

    // If no locations found within tolerance, return space
    if (locationsWithinTolerance.length === 0) {
      return spaceLocation;
    }

    // Return the closest location
    let closestLocation = locationsWithinTolerance[0];
    let closestDistance = calculateDistanceBetweenPositions(
      position,
      closestLocation.position,
    );

    for (let i = 1; i < locationsWithinTolerance.length; i++) {
      const currentLocation = locationsWithinTolerance[i];
      const currentDistance = calculateDistanceBetweenPositions(
        position,
        currentLocation.position,
      );

      if (currentDistance.value < closestDistance.value) {
        closestLocation = currentLocation;
        closestDistance = currentDistance;
      }
    }

    return closestLocation;
  }
}
