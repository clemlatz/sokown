import Ship from '../models/Ship';
import calculateNewPosition from '../helpers/calculateNewPosition';
import LocationRepository from '../repositories/LocationRepository';
import EventRepository from '../repositories/EventRepository';

export default async function moveShipTowardsDestinationUsecase(
  ship: Ship,
  eventRepository: EventRepository,
): Promise<Ship> {
  const newPosition = calculateNewPosition(
    ship.currentPosition,
    ship.destinationPosition,
    ship.speed,
  );
  if (
    newPosition.x === ship.currentPosition.x &&
    newPosition.y === ship.currentPosition.y
  ) {
    const locationRepository = new LocationRepository();
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
