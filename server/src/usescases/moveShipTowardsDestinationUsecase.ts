import Ship from '../models/Ship';
import calculateNewPosition from '../helpers/calculateNewPosition';

type loggerFunction = (message: string) => void;

export default async function moveShipTowardsDestinationUsecase(
  ship: Ship,
  logger: loggerFunction,
): Promise<Ship> {
  const newPosition = calculateNewPosition(
    ship.currentPosition,
    ship.destination.position,
    1,
  );
  if (
    newPosition.x === ship.currentPosition.x &&
    newPosition.y === ship.currentPosition.y
  ) {
    logger(`Ship ${ship.name} has arrived at ${ship.destination.name}`);
    ship.resetDestination();
    return ship;
  }

  logger(
    `Ship ${ship.name} moved to ${newPosition} (going to ${ship.destination.name})`,
  );
  ship.currentPosition = newPosition;
  return ship;
}
