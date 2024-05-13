import Ship from '../models/Ship';
import calculateNewPosition from '../helpers/calculateNewPosition';
import calculateAngleBetweenPositions from '../helpers/calculateAngleBetweenPositions';
import LocationRepository from '../repositories/LocationRepository';
import EventRepository from '../repositories/EventRepository';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';
import DistanceInKilometers from '../values/DistanceInKilometers';
import Position from '../models/Position';

export default class MoveShipTowardsDestinationUsecase {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(ship: Ship): Promise<Ship> {
    const timeElapsedInSeconds = 1;
    const distanceTraveledInKm = this._getDistanceTraveledAtSpeedInTime(
      ship.speed,
      timeElapsedInSeconds,
    );
    const newPosition = calculateNewPosition(
      ship.currentPosition,
      ship.destinationPosition,
      distanceTraveledInKm,
    );

    ship.currentLocationCode = this.locationRepository.findByPosition(
      ship.currentPosition,
    ).code;

    if (this._shipDidNotMove(newPosition, ship)) {
      const destinationLocation =
        this.locationRepository.findByPosition(newPosition);
      if (destinationLocation) {
        await this.eventRepository.create(
          `has arrived at ${destinationLocation.name} (${ship.destinationPosition})`,
          ship,
          destinationLocation,
        );
      }
      ship.resetDestination();
      return ship;
    } else {
      ship.currentCourse = calculateAngleBetweenPositions(
        ship.currentPosition,
        ship.destinationPosition,
      );
    }

    ship.currentPosition = newPosition;
    return ship;
  }

  private _shipDidNotMove(newPosition: Position, ship: Ship) {
    return (
      newPosition.x === ship.currentPosition.x &&
      newPosition.y === ship.currentPosition.y
    );
  }

  private _getDistanceTraveledAtSpeedInTime(
    speed: SpeedInKilometersPerSecond,
    timeElapsedInSeconds: number,
  ): DistanceInKilometers {
    return new DistanceInKilometers(speed.value * timeElapsedInSeconds);
  }
}
