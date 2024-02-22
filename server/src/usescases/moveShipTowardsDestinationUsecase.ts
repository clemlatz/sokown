import Ship from '../models/Ship';
import calculateNewPosition from '../helpers/calculateNewPosition';
import LocationRepository from '../repositories/LocationRepository';

type loggerFunction = (message: string) => void;

export default async function moveShipTowardsDestinationUsecase(
  ship: Ship,
  logger: loggerFunction,
): Promise<Ship> {
  const newPosition = calculateNewPosition(
    ship.currentPosition,
    ship.destinationPosition,
    1,
  );
  if (
    newPosition.x === ship.currentPosition.x &&
    newPosition.y === ship.currentPosition.y
  ) {
    const locationRepository = new LocationRepository();
    const destinationLocation = locationRepository.findByPosition(newPosition);
    if (destinationLocation) {
      logger(
        `Ship ${ship.name} has arrived at ${destinationLocation.name} (${ship.destinationPosition})`,
      );
    } else {
      logger(`Ship ${ship.name} has arrived at ${ship.destinationPosition}`);
    }
    ship.resetDestination();
    return ship;
  }

  logger(`Ship ${ship.name} moved to ${newPosition}`);
  ship.currentPosition = newPosition;
  return ship;
}
