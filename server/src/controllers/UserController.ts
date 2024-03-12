import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import UserRepository from '../repositories/UserRepository';
import AuthenticationGuard from '../guards/AuthenticationGuard';
import SessionToken from '../models/SessionToken';
import RegisterNewPilotUsecase from '../usescases/RegisterNewPilotUsecase';

class UserToCreateDTO {
  data: {
    attributes: {
      pilotName: string;
      shipName: string;
      hasEnabledNotifications: boolean;
    };
  };
}

@Controller()
export default class UserController {
  constructor(
    private readonly registerNewPilotUsecase: RegisterNewPilotUsecase,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('api/users')
  async create(
    @Session() session: SessionToken,
    @Body() body: UserToCreateDTO,
    @Res() res: Response,
  ): Promise<void> {
    const { attributes } = body.data;
    await this.registerNewPilotUsecase.execute(
      session.sub,
      attributes.pilotName,
      attributes.hasEnabledNotifications,
      attributes.shipName,
    );

    res.send({
      data: {
        id: 'me',
        type: 'user',
        attributes: {
          pilotName: attributes.pilotName,
        },
      },
    });
  }

  @Get('api/users/me')
  @UseGuards(AuthenticationGuard)
  async me(
    @Session() session: SessionToken,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.userRepository.getByAuthenticationMethodId(
      session.sub,
    );
    res.json({
      data: {
        id: 'me',
        type: 'user',
        attributes: {
          pilotName: user.pilotName,
        },
      },
    });
  }
}
