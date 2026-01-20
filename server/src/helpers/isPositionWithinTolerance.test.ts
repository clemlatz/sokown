import Position from '../models/Position';
import DistanceInSokownUnits from '../values/DistanceInSokownUnits';
import isPositionWithinTolerance, {
  LOCATION_PROXIMITY_TOLERANCE,
} from './isPositionWithinTolerance';

describe('isPositionWithinTolerance', () => {
  it('returns true for identical positions', () => {
    const position1 = new Position(10.0, 20.0);
    const position2 = new Position(10.0, 20.0);

    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });

  it('returns true for positions within tolerance', () => {
    const position1 = new Position(10.0, 20.0);
    const position2 = new Position(10.05, 20.05);

    // Distance: sqrt(0.05^2 + 0.05^2) ≈ 0.0707 SU < 0.1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });

  it('returns true for positions exactly at tolerance boundary', () => {
    const position1 = new Position(0.0, 0.0);
    const position2 = new Position(0.1, 0.0);

    // Distance: exactly 0.1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });

  it('returns false for positions outside tolerance', () => {
    const position1 = new Position(10.0, 20.0);
    const position2 = new Position(10.15, 20.0);

    // Distance: 0.15 SU > 0.1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(false);
  });

  it('returns false for positions significantly outside tolerance', () => {
    const position1 = new Position(1.0, 1.0);
    const position2 = new Position(3.0, 4.0);

    // Distance: sqrt(4 + 9) ≈ 3.606 SU >> 0.1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(false);
  });

  it('uses default tolerance when not specified', () => {
    const position1 = new Position(5.0, 5.0);
    const position2 = new Position(5.08, 5.06);

    // Distance: sqrt(0.08^2 + 0.06^2) = 0.1 SU
    expect(isPositionWithinTolerance(position1, position2)).toBe(true);
  });

  it('accepts custom tolerance values', () => {
    const position1 = new Position(0.0, 0.0);
    const position2 = new Position(0.5, 0.0);
    const customTolerance = new DistanceInSokownUnits(1.0);

    // Distance: 0.5 SU < 1.0 SU (custom tolerance)
    expect(
      isPositionWithinTolerance(position1, position2, customTolerance),
    ).toBe(true);

    // Same positions with default tolerance would be false
    expect(isPositionWithinTolerance(position1, position2)).toBe(false);
  });

  it('exports LOCATION_PROXIMITY_TOLERANCE constant', () => {
    expect(LOCATION_PROXIMITY_TOLERANCE).toBeInstanceOf(DistanceInSokownUnits);
    expect(LOCATION_PROXIMITY_TOLERANCE.value).toBe(0.1);
  });
});
