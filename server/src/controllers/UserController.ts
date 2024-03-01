import { Controller, Get, Res, Session, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import AuthenticationGuard from '../guards/AuthenticationGuard';
import SessionToken from '../models/SessionToken';

@Controller()
export default class UserController {
  constructor(private readonly userRepository: UserRepository) {}

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
