import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { isNumber } from '@nestjs/common/utils/shared.utils';
import crypto from 'node:crypto';

import OpenIDConnectService from '../services/OpenIDConnectService';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import SessionToken from '../models/SessionToken';

@Controller()
export default class OpenIDConnectController {
  constructor(
    private readonly authenticationMethodRepository: AuthenticationMethodRepository,
    private readonly openIDConnectService: OpenIDConnectService,
  ) {}

  @Get('auth/openid/login')
  async login(
    @Session() session: SessionToken,
    @Res() response: Response,
  ): Promise<void> {
    const randomState = crypto.randomBytes(16).toString('hex');

    const sessionToken = new SessionToken({ state: randomState });
    sessionToken.writeTo(session);

    const authorizationUrl = this.openIDConnectService.getAuthorizationUrl(
      session.state,
    );

    response.redirect(authorizationUrl);
  }

  @Get('auth/openid/callback')
  async callback(
    @Session() session: SessionToken,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const tokenSet = await this.openIDConnectService.getTokens(
      request,
      session.state,
    );
    const { sub } = tokenSet.claims();
    const externalId = isNumber(sub) ? (sub as number).toString() : sub;
    let authenticationMethod =
      await this.authenticationMethodRepository.findByProviderAndExternalId(
        'axys',
        externalId,
      );

    if (authenticationMethod === null) {
      authenticationMethod = await this.authenticationMethodRepository.create(
        'axys',
        externalId,
      );
    }

    const sessionToken = new SessionToken({ sub: authenticationMethod.id });
    sessionToken.writeTo(session);

    if (authenticationMethod.user === null) {
      response.redirect('/user/signup');
      return;
    }

    response.redirect('/');
  }

  @Get('auth/openid/logout')
  async logout(
    @Session() session: SessionToken,
    @Res() response: Response,
  ): Promise<void> {
    const sessionToken = new SessionToken({});
    sessionToken.writeTo(session);
    response.redirect('/');
  }
}
