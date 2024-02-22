import Ship from '../models/Ship';
import calculateNewPosition from '../helpers/calculateNewPosition';

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
    logger(`Ship ${ship.name} has arrived at ${ship.destinationPosition}`);
    ship.resetDestination();
    return ship;
  }

  logger(`Ship ${ship.name} moved to ${newPosition}`);
  ship.currentPosition = newPosition;
  return ship;
}
