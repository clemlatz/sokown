import Position from "../models/Position";

export default function calculateNewPosition(
  startPosition: Position,
  destinationPosition: Position,
  distanceTraveled: number
): Position {

  const distanceToDestination = Math.sqrt(
    Math.pow(destinationPosition.x - startPosition.x, 2) + Math.pow(destinationPosition.y - startPosition.y, 2)
  );

  if (distanceToDestination < distanceTraveled) {
    return destinationPosition;
  }

  const newX = startPosition.x + (((destinationPosition.x - startPosition.x) * distanceTraveled) / distanceToDestination);
  const newY = startPosition.y + (((destinationPosition.y - startPosition.y) * distanceTraveled) / distanceToDestination);

  return new Position(newX, newY);
}
