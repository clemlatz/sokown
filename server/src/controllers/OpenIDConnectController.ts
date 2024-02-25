import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { isNumber } from '@nestjs/common/utils/shared.utils';
import crypto from 'node:crypto';

import OpenIDConnectService from '../services/OpenIDConnectService';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import { CookieSession } from '../types';

@Controller()
export default class OpenIDConnectController {
  constructor(
    private readonly authenticationMethodRepository: AuthenticationMethodRepository,
    private readonly openIDConnectService: OpenIDConnectService,
  ) {}

  @Get('auth/openid/login')
  async login(
    @Session() session: CookieSession,
    @Res() response: Response,
  ): Promise<void> {
    session.state = crypto.randomBytes(16).toString('hex');
    const authorizationUrl = this.openIDConnectService.getAuthorizationUrl(
      session.state,
    );

    response.redirect(authorizationUrl);
  }

  @Get('auth/openid/callback')
  async callback(
    @Session() session: CookieSession,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const tokenSet = await this.openIDConnectService.getTokens(
      request,
      session.state,
    );
    const { sub, exp } = tokenSet.claims();
    const externalId = isNumber(sub) ? (sub as number).toString() : sub;
    const authenticationMethod =
      await this.authenticationMethodRepository.findByProviderAndExternalId(
        'axys',
        externalId,
      );

    if (!authenticationMethod) {
      response.status(401);
      response.send();
      return;
    }

    session.authenticationMethodId = authenticationMethod.id;
    session.sessionExpiresAt = exp;

    response.redirect('/');
  }
}
