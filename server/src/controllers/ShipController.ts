import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';
import Ship from '../models/Ship';

@Controller()
export class ShipController {
  constructor(
    private readonly shipRepository: ShipRepository,
    private readonly locationRepository: LocationRepository,
  ) {}

  @Get('api/ships')
  async index(@Res() res: Response): Promise<void> {
    const ships = await this.shipRepository.getAll();
    const shipsData = ships.map((ship) => this._serializeShip(ship));
    res.json({ data: shipsData });
  }

  @Get('api/ships/:id')
  async get(
    @Res() res: Response,
    @Param() params: { id: string },
  ): Promise<void> {
    const ship = await this.shipRepository.getById(parseInt(params.id));
    const shipData = this._serializeShip(ship);
    res.json({ data: shipData });
  }

  private _serializeShip(ship: Ship) {
    const currentLocation = this.locationRepository.findByPosition(
      ship.currentPosition,
    );
    const destinationLocation = ship.isStationary
      ? null
      : this.locationRepository.findByPosition(ship.destinationPosition);
    return {
      id: ship.id,
      type: 'ship',
      attributes: {
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
      },
    };
  }
}
