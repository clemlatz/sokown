import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import OpenIDConnectController from './OpenIDConnectController';
import OpenIDConnectService from '../services/OpenIDConnectService';
import { TokenSet } from 'openid-client';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import AuthenticationMethod from '../models/AuthenticationMethod';
import User from '../models/User';
import SessionToken from '../models/SessionToken';

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
      const session = new SessionToken({});
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
    describe('when auth method and user already exists', () => {
      it('it logs user in', async () => {
        // given
        const givenUser = new User(1, 'Jimmy Doolittle');
        const givenAuthenticationMethod = new AuthenticationMethod(
          2,
          'external-id',
          givenUser,
        );
        const session = new SessionToken({ state: 'state-from-cookie' });

        const request = {} as Request;
        const response = {
          redirect: jest.fn(),
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
          .mockResolvedValue(givenAuthenticationMethod);
        jest.useFakeTimers().setSystemTime(new Date('2019-04-28'));

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
        expect(session.sub).toEqual(2);
        expect(session.exp).toEqual(1556496000);
        expect(response.redirect).toHaveBeenCalledWith('/');
      });
    });

    describe('when auth method does not exist', () => {
      it('it creates it and redirects to signup page', async () => {
        // given
        const session = new SessionToken({ state: 'state-from-cookie' });

        const request = {} as Request;
        const response = {
          redirect: jest.fn(),
        } as unknown as Response;
        const tokenSet = {
          claims: jest.fn().mockReturnValue({
            sub: 'external-id',
          }),
        } as unknown as TokenSet;
        jest
          .spyOn(openIDConnectService, 'getTokens')
          .mockResolvedValue(tokenSet);
        jest
          .spyOn(authenticationMethodRepository, 'findByProviderAndExternalId')
          .mockResolvedValue(null);
        jest
          .spyOn(authenticationMethodRepository, 'create')
          .mockResolvedValue(new AuthenticationMethod(1, 'external-id'));

        // when
        await openIDConnectController.callback(session, request, response);

        // then
        expect(openIDConnectService.getTokens).toHaveBeenCalledWith(
          request,
          'state-from-cookie',
        );
        expect(
          authenticationMethodRepository.findByProviderAndExternalId,
        ).toHaveBeenCalledWith('axys', 'external-id');
        expect(authenticationMethodRepository.create).toHaveBeenCalledWith(
          'axys',
          'external-id',
        );
        expect(session.sub).toEqual(1);
        expect(session.exp).toEqual(1556496000);
        expect(response.redirect).toHaveBeenCalledWith('/user/signup');
      });
    });
  });

  describe('logout', () => {
    it('it erases session and redirects to /', async () => {
      // given
      const session = new SessionToken({ sub: 1 });
      const response = {
        redirect: jest.fn(),
      } as unknown as Response;

      // when
      await openIDConnectController.logout(session, response);

      // then
      expect(session.sub).toBeNull();
      expect(response.redirect).toHaveBeenCalledWith('/');
    });
  });
});
