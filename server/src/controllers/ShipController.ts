import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import ShipRepository from '../repositories/ShipRepository';
import LocationRepository from '../repositories/LocationRepository';
import Ship from '../models/Ship';
import Position from '../models/Position';
import EventRepository from '../repositories/EventRepository';
import AuthenticationGuard from '../guards/AuthenticationGuard';
import calculateTimeToDestination from '../helpers/calculateTimeToDestination';

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
    private readonly eventRepository: EventRepository,
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
    const timeToDestination = ship.isStationary
      ? null
      : calculateTimeToDestination(
          ship.currentPosition,
          ship.destinationPosition,
          ship.speed,
        );
    const shipData = this._serializeShip(ship, timeToDestination);
    res.json({ data: shipData });
  }

  @UseGuards(AuthenticationGuard)
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

    const currentLocation = this.locationRepository.findByPosition(
      ship.currentPosition,
    );
    const destinationLocation = this.locationRepository.findByPosition(
      ship.destinationPosition,
    );
    await this.eventRepository.create(
      `has departed from ${currentLocation.name} to ${destinationLocation.name}`,
      ship,
      currentLocation,
    );

    res.status(HttpStatus.NO_CONTENT);
    res.send();
  }

  private _serializeShip(ship: Ship, timeToDestination: number | null = null) {
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
        owner: { id: ship.owner.id, pilotName: ship.owner.pilotName },
        name: ship.name,
        speedInKilometersPerSecond: ship.speed.value,
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
        timeToDestination,
      },
    };
  }
}
