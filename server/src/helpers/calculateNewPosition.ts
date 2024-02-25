import Position from '../models/Position';
import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';

export default function calculateNewPosition(
  startPosition: Position,
  destinationPosition: Position,
  distanceTraveled: number,
): Position {
  const distanceToDestination = calculateDistanceBetweenPositions(
    startPosition,
    destinationPosition,
  );

  if (distanceToDestination < distanceTraveled) {
    return destinationPosition;
  }

  const newX =
    startPosition.x +
    ((destinationPosition.x - startPosition.x) * distanceTraveled) /
      distanceToDestination;
  const newY =
    startPosition.y +
    ((destinationPosition.y - startPosition.y) * distanceTraveled) /
      distanceToDestination;

  return new Position(newX, newY);
}
