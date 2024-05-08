import Location from '../models/Location';
import AstronomyService from '../services/AstronomyService';
import ShipRepository from '../repositories/ShipRepository';
import calculateDistanceBetweenPositions from '../helpers/calculateDistanceBetweenPositions';
import DistanceInSokownUnits from '../values/DistanceInSokownUnits';

export default class UpdateLocationPositionUsecase {
  constructor(
    private readonly astronomyService: AstronomyService,
    private readonly shipRepository: ShipRepository,
  ) {}

  async execute(location: Location) {
    const position = await this.astronomyService.getPositionFor(location.code);
    location.setPosition(position);

    location.distanceFromPrimaryBody = location.primaryBody
      ? calculateDistanceBetweenPositions(
          location.primaryBody.position,
          location.position,
        )
      : new DistanceInSokownUnits(0);

    const shipsAtPositions =
      await this.shipRepository.getAllAtLocation(location);
    for (const ship of shipsAtPositions) {
      ship.currentPosition = location.position;
      await this.shipRepository.update(ship);
    }
  }
}
