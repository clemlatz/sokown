import Ship from '../models/Ship';
import calculateNewPosition from '../helpers/calculateNewPosition';
import LocationRepository from '../repositories/LocationRepository';
import EventRepository from '../repositories/EventRepository';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';
import DistanceInKilometers from '../values/DistanceInKilometers';

export default async function moveShipTowardsDestinationUsecase(
  ship: Ship,
  locationRepository: LocationRepository,
  eventRepository: EventRepository,
): Promise<Ship> {
  const timeElapsedInSeconds = 1;
  const distanceTraveledInKm = _getDistanceAtSpeedInTime(
    ship.speed,
    timeElapsedInSeconds,
  );
  const newPosition = calculateNewPosition(
    ship.currentPosition,
    ship.destinationPosition,
    distanceTraveledInKm,
  );
  if (
    newPosition.x === ship.currentPosition.x &&
    newPosition.y === ship.currentPosition.y
  ) {
    const destinationLocation = locationRepository.findByPosition(newPosition);
    if (destinationLocation) {
      await eventRepository.create(
        `has arrived at ${destinationLocation.name} (${ship.destinationPosition})`,
        ship,
        destinationLocation,
      );
    }
    ship.resetDestination();
    return ship;
  }

  ship.currentPosition = newPosition;
  return ship;
}

function _getDistanceAtSpeedInTime(
  speed: SpeedInKilometersPerSecond,
  timeElapsedInSeconds: number,
): DistanceInKilometers {
  return new DistanceInKilometers(speed.value * timeElapsedInSeconds);
}
