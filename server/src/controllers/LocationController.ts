import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import LocationRepository from '../repositories/LocationRepository';
import Location from '../models/Location';
import AstronomyService from '../services/AstronomyService';

@Controller()
export default class LocationController {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly astronomyService: AstronomyService,
  ) {}

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

  @Get('api/locations/:code/position')
  async getPosition(
    @Param() params: { code: string },
    @Query() query: { targetDate: string },
    @Res() res: Response,
  ): Promise<void> {
    const { x, y } = await this.astronomyService.getPositionFor(
      params.code,
      new Date(parseInt(query.targetDate)),
    );
    res.json({
      data: {
        id: params.code,
        type: 'position',
        attributes: { x, y },
      },
    });
  }

  private _serializeLocation(location: Location) {
    const primaryBodyPosition = location.primaryBody
      ? {
          x: location.primaryBody.position.x,
          y: location.primaryBody.position.y,
        }
      : null;

    return {
      id: location.code,
      type: 'location',
      attributes: {
        name: location.name,
        color: location.color,
        position: {
          x: location.position.x,
          y: location.position.y,
        },
        primaryBodyPosition,
        distanceFromPrimaryBody: location.distanceFromPrimaryBody.value,
      },
    };
  }
}
