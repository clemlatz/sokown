import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';

@Controller()
export class ShipController {
  constructor(private readonly shipRepository: ShipRepository) {}

  @Get('ships')
  async index(@Res() res: Response): Promise<void> {
    const ships = await this.shipRepository.getAll();
    const locationRepository = new LocationRepository();
    const shipsResponse = ships.map((ship) => {
      const currentLocation = locationRepository.findByPosition(
        ship.currentPosition,
      );
      const destinationLocation = ship.isStationary
        ? null
        : locationRepository.findByPosition(ship.destinationPosition);
      return {
        id: ship.id,
        name: ship.name,
        currentPosition: {
          x: ship.currentPosition.x,
          y: ship.currentPosition.y,
        },
        currentLocation: currentLocation
          ? { name: currentLocation.name }
          : null,
        destinationPosition: ship.isStationary
          ? null
          : { x: ship.destinationPosition.x, y: ship.destinationPosition.y },
        destinationLocation: destinationLocation
          ? { name: destinationLocation.name }
          : null,
      };
    });
    res.json(shipsResponse);
  }
}
