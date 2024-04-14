import Location from '../models/Location';
import AstronomyService from '../services/AstronomyService';

export default class UpdateLocationPositionUsecase {
  constructor(private readonly astronomyService: AstronomyService) {}

  async execute(location: Location) {
    const position = await this.astronomyService.getPositionFor(location.code);
    location.setPosition(position);
  }
}
