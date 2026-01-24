import Ship from '../models/Ship';
import calculateNewPosition from '../helpers/calculateNewPosition';
import calculateAngleBetweenPositions from '../helpers/calculateAngleBetweenPositions';
import LocationRepository from '../repositories/LocationRepository';
import EventRepository from '../repositories/EventRepository';
import SpeedInKilometersPerSecond from '../values/SpeedInKilometersPerSecond';
import DistanceInKilometers from '../values/DistanceInKilometers';
import Position from '../models/Position';
import MailerService from '../services/MailerService';

export default class MoveShipTowardsDestinationUsecase {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly eventRepository: EventRepository,
    private readonly mailerService: MailerService,
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

    // Check if ship has arrived (within tolerance of destination)
    if (this._hasArrivedAtDestination(newPosition, ship)) {
      // Snap ship to exact destination coordinates
      ship.currentPosition = ship.destinationPosition;

      const destinationLocation = this.locationRepository.findByPosition(
        ship.destinationPosition,
      );
      if (destinationLocation) {
        await this.eventRepository.create(
          `has arrived at ${destinationLocation.name} (${ship.destinationPosition})`,
          ship,
          destinationLocation,
        );

        if (ship.owner.hasEnabledNotifications) {
          this.mailerService
            .sendMailNotification(ship, destinationLocation)
            .catch((error) => {
              console.error(
                `Failed to send arrival notification for ship ${ship.id}:`,
                error,
              );
            });
        }
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

  private _hasArrivedAtDestination(newPosition: Position, ship: Ship) {
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
