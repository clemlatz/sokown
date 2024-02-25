import Position from '../models/Position';
import calculateDistanceBetweenPositions from './calculateDistanceBetweenPositions';
import convertKilometersToSokownUnits from './convertKilometersToSokownUnits';

export default function calculateNewPosition(
  startPosition: Position,
  destinationPosition: Position,
  distanceTraveledInKm: number,
): Position {
  const distanceToDestination = calculateDistanceBetweenPositions(
    startPosition,
    destinationPosition,
  );
  const distanceTraveledInSU =
    convertKilometersToSokownUnits(distanceTraveledInKm);

  if (distanceToDestination < distanceTraveledInSU) {
    return destinationPosition;
  }

  const newX =
    startPosition.x +
    ((destinationPosition.x - startPosition.x) * distanceTraveledInSU) /
      distanceToDestination;
  const newY =
    startPosition.y +
    ((destinationPosition.y - startPosition.y) * distanceTraveledInSU) /
      distanceToDestination;

  return new Position(newX, newY);
}
