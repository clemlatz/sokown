import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import ShipRepository from '../repositories/ShipRepository';

@Controller()
export class ShipController {
  constructor(private readonly shipRepository: ShipRepository) {}

  @Get('ships')
  async index(@Res() res: Response): Promise<void> {
    const ships = await this.shipRepository.getAll();
    const shipsResponse = ships.map((ship) => {
      return {
        id: ship.id,
        name: ship.name,
        position: { x: ship.currentPosition.x, y: ship.currentPosition.y },
        destination: ship.isStationary ? null : { name: ship.destination.name },
      };
    });
    res.json(shipsResponse);
  }
}
