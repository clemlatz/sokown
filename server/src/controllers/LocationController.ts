import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import LocationRepository from '../repositories/LocationRepository';
import Location from '../models/Location';

@Controller()
export default class LocationController {
  constructor(private readonly locationRepository: LocationRepository) {}

  @Get('api/locations')
  async index(@Res() res: Response): Promise<void> {
    const locations = this.locationRepository.getAll();
    const locationsData = locations.map((location) =>
      this._serializeLocation(location),
    );
    res.json({ data: locationsData });
  }

  @Get('api/locations/:code')
  async get(
    @Param() params: { code: string },
    @Res() res: Response,
  ): Promise<void> {
    const location = this.locationRepository.getByCode(params.code);
    res.json({ data: this._serializeLocation(location) });
  }

  private _serializeLocation(location: Location) {
    return {
      id: location.code,
      type: 'location',
      attributes: {
        name: location.name,
        position: {
          x: location.position.x,
          y: location.position.y,
        },
      },
    };
  }
}
