import AstronomicalObject from 'astronomy-bundle/astronomicalObject/AstronomicalObject';
import { createEarth } from 'astronomy-bundle/earth';
import { createSun } from 'astronomy-bundle/sun';
import { createMoon } from 'astronomy-bundle/moon';
import { createMars } from 'astronomy-bundle/planets';

import Position from '../models/Position';
import { createTimeOfInterest } from 'astronomy-bundle/time';
import TimeOfInterest from 'astronomy-bundle/time/TimeOfInterest';

export default class AstronomyService {
  async getPositionFor(
    locationCode: string,
    atDate: Date = new Date(),
  ): Promise<Position> {
    const timeOfInterest = createTimeOfInterest.fromDate(atDate);
    const astronomicalObject =
      AstronomyService.getAstronomicalObjectForLocationCode(
        locationCode,
        timeOfInterest,
      );

    const { x, y } =
      await astronomicalObject.getHeliocentricEclipticRectangularJ2000Coordinates();

    const xInSokownUnits = x * 1000;
    const yInSokownUnits = y * 1000;

    return new Position(xInSokownUnits, yInSokownUnits);
  }

  private static getAstronomicalObjectForLocationCode(
    locationCode: string,
    timeOfInterest: TimeOfInterest,
  ): AstronomicalObject {
    if (locationCode === 'earth') {
      return createEarth(timeOfInterest);
    }

    if (locationCode === 'mars') {
      return createMars(timeOfInterest);
    }

    if (locationCode === 'moon') {
      return createMoon(timeOfInterest);
    }

    if (locationCode === 'sun') {
      return createSun(timeOfInterest);
    }
  }
}
