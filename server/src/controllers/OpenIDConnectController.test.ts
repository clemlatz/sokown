import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import OpenIDConnectController from './OpenIDConnectController';
import OpenIDConnectService from '../services/OpenIDConnectService';
import { TokenSet } from 'openid-client';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import AuthenticationMethod from '../models/AuthenticationMethod';
import User from '../models/User';
import { CookieSession } from '../types';

describe('OpenIDConnectController', () => {
  let openIDConnectController: OpenIDConnectController;
  let authenticationMethodRepository: AuthenticationMethodRepository;
  let openIDConnectService: OpenIDConnectService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OpenIDConnectController],
      providers: [
        PrismaClient,
        AuthenticationMethodRepository,
        {
          provide: OpenIDConnectService,
          useFactory: () => {
            return { getAuthorizationUrl: jest.fn(), getTokens: jest.fn() };
          },
        },
      ],
    }).compile();

    openIDConnectController = app.get<OpenIDConnectController>(
      OpenIDConnectController,
    );
    openIDConnectService = app.get<OpenIDConnectService>(OpenIDConnectService);
    authenticationMethodRepository = app.get<AuthenticationMethodRepository>(
      AuthenticationMethodRepository,
    );
  });

  describe('login', () => {
    it('it redirects to oidc provider authorization url', async () => {
      // given
      const session: CookieSession = {};
      const response = {
        redirect: jest.fn(),
      } as unknown as Response;
      jest
        .spyOn(openIDConnectService, 'getAuthorizationUrl')
        .mockReturnValue('https://oidc.example.org/authorize');

      // when
      await openIDConnectController.login(session, response);

      // then
      expect(session.state).toHaveLength(32);
      expect(openIDConnectService.getAuthorizationUrl).toHaveBeenCalledWith(
        session.state,
      );
      expect(response.redirect).toHaveBeenCalledWith(
        'https://oidc.example.org/authorize',
      );
    });
  });

  describe('callback', () => {
    describe('when user already exists', () => {
      it('it logs user in', async () => {
        // given
        const givenUser = new User(1, 'Jimmy Doolittle');
        const givenAuthenticationMethod = new AuthenticationMethod(
          2,
          'external-id',
          givenUser,
        );
        const session: CookieSession = {
          state: 'state-from-cookie',
        };
        const request = {} as Request;
        const response = {
          redirect: jest.fn(),
        } as unknown as Response;
        const tokenSet = {
          claims: jest.fn().mockReturnValue({
            sub: 1,
            exp: 1709702870,
          }),
        } as unknown as TokenSet;
        jest
          .spyOn(openIDConnectService, 'getTokens')
          .mockResolvedValue(tokenSet);
        jest
          .spyOn(authenticationMethodRepository, 'findByProviderAndExternalId')
          .mockResolvedValue(givenAuthenticationMethod);

        // when
        await openIDConnectController.callback(session, request, response);

        // then
        expect(openIDConnectService.getTokens).toHaveBeenCalledWith(
          request,
          'state-from-cookie',
        );
        expect(
          authenticationMethodRepository.findByProviderAndExternalId,
        ).toHaveBeenCalledWith('axys', '1');
        expect(session.authenticationMethodId).toEqual(2);
        expect(session.sessionExpiresAt).toEqual(1709702870);
        expect(response.redirect).toHaveBeenCalledWith('/');
      });
    });

    describe('when user does not exist', () => {
      it('it returns 401', async () => {
        // given
        const session: CookieSession = {
          state: 'state-from-cookie',
        };
        const request = {} as Request;
        const response = {
          status: jest.fn(),
          send: jest.fn(),
        } as unknown as Response;
        const tokenSet = {
          claims: jest.fn().mockReturnValue({
            sub: 1,
          }),
        } as unknown as TokenSet;
        jest
          .spyOn(openIDConnectService, 'getTokens')
          .mockResolvedValue(tokenSet);
        jest
          .spyOn(authenticationMethodRepository, 'findByProviderAndExternalId')
          .mockResolvedValue(null);

        // when
        await openIDConnectController.callback(session, request, response);

        // then
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.send).toHaveBeenCalledWith();
        expect(openIDConnectService.getTokens).toHaveBeenCalledWith(
          request,
          'state-from-cookie',
        );
        expect(
          authenticationMethodRepository.findByProviderAndExternalId,
        ).toHaveBeenCalledWith('axys', '1');
      });
    });
  });
});
