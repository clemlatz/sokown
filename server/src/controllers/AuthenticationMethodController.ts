import { Controller, Get, Res, Session } from '@nestjs/common';
import { Response } from 'express';

import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import SessionToken from '../models/SessionToken';

@Controller()
export default class AuthenticationMethodController {
  constructor(
    private readonly authenticationMethodRepository: AuthenticationMethodRepository,
  ) {}

  @Get('api/authentication-methods/current')
  async current(@Session() session: SessionToken, @Res() response: Response) {
    const authenticationMethod =
      await this.authenticationMethodRepository.getById(session.sub);

    response.json({
      data: {
        id: 'current',
        type: 'authenticationMethod',
        attributes: {
          idTokenClaims: authenticationMethod.idTokenClaims,
        },
      },
    });
  }
}
