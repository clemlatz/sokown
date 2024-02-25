import Position from '../models/Position';

export default function calculateDistanceBetweenPositions(
  position1: Position,
  position2: Position,
) {
  return Math.sqrt(
    Math.pow(position2.x - position1.x, 2) +
      Math.pow(position2.y - position1.y, 2),
  );
}
