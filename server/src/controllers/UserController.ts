import { Controller, Get, Res, Session, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CookieSession } from '../types';
import UserRepository from '../repositories/UserRepository';
import AuthenticationGuard from '../guards/AuthenticationGuard';

@Controller()
export default class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get('api/users/me')
  @UseGuards(AuthenticationGuard)
  async me(
    @Session() session: CookieSession,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.userRepository.getByAuthenticationMethodId(
      session.authenticationMethodId,
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
