import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';
import Ship from '../models/Ship';
import Position from '../models/Position';

class UpdateShipDTO {
  readonly data: {
    attributes: {
      destinationPosition: {
        x: number;
        y: number;
      };
    };
  };
}

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

  @Patch('api/ships/:id')
  async update(
    @Param() params: { id: string },
    @Body() body: UpdateShipDTO,
    @Res() res: Response,
  ): Promise<void> {
    const { destinationPosition } = body.data.attributes;
    const ship = await this.shipRepository.getById(parseInt(params.id));
    const newDestinationPosition = new Position(
      destinationPosition.x,
      destinationPosition.y,
    );
    ship.setDestination(newDestinationPosition);
    await this.shipRepository.update(ship);

    res.status(HttpStatus.NO_CONTENT);
    res.send();
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
