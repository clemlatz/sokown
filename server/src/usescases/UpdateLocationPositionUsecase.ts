import Location from '../models/Location';
import AstronomyService from '../services/AstronomyService';
import ShipRepository from '../repositories/ShipRepository';

export default class UpdateLocationPositionUsecase {
  constructor(
    private readonly astronomyService: AstronomyService,
    private readonly shipRepository: ShipRepository,
  ) {}

  async execute(location: Location) {
    const position = await this.astronomyService.getPositionFor(location.code);
    location.setPosition(position);

    const shipsAtPositions =
      await this.shipRepository.getAllAtLocation(location);
    for (const ship of shipsAtPositions) {
      ship.currentPosition = location.position;
      await this.shipRepository.update(ship);
    }
  }
}
