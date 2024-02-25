import OpenIDConnectService from './OpenIDConnectService';
import { Issuer, TokenSet } from 'openid-client';
import { Request } from 'express';

describe('OpenIDConnectService', () => {
  describe('getAuthorizationUrl', () => {
    it('returns authentication url', () => {
      // given
      const getAuthorizationUrlFunction = jest
        .fn()
        .mockReturnValue('https://oidc.example.com/authorize');
      // noinspection JSUnusedGlobalSymbols
      const OIDCClientMock = class {
        authorizationUrl = getAuthorizationUrlFunction;
      };
      const issuer = { Client: OIDCClientMock } as unknown as Issuer;
      const openIdConnectService = new OpenIDConnectService(issuer);
      const state = 'a-random-state';

      // when
      const authorizationUrl = openIdConnectService.getAuthorizationUrl(state);

      // then
      expect(getAuthorizationUrlFunction).toHaveBeenCalledWith({
        scope: 'openid email username',
        state: 'a-random-state',
      });
      expect(authorizationUrl).toEqual('https://oidc.example.com/authorize');
    });
  });

  describe('getTokens', () => {
    it('returns tokens', async () => {
      // given
      process.env.AXYS_REDIRECT_URI = 'https://oidc.example.com/redirect-uri';
      const callbackParamsFunction = jest
        .fn()
        .mockReturnValue({ state: 'state-from-query' });
      const givenTokens = new TokenSet();
      const callbackFunction = jest.fn().mockResolvedValue(givenTokens);
      // noinspection JSUnusedGlobalSymbols
      const OIDCClientMock = class {
        callbackParams = callbackParamsFunction;
        callback = callbackFunction;
      };
      const issuer = { Client: OIDCClientMock } as unknown as Issuer;
      const openIdConnectService = new OpenIDConnectService(issuer);
      const request = {} as Request;

      // when
      const tokens = await openIdConnectService.getTokens(
        request,
        'state-from-cookie',
      );

      // then
      expect(tokens).toBe(givenTokens);
      expect(callbackParamsFunction).toHaveBeenCalledWith(request);
      expect(callbackFunction).toHaveBeenCalledWith(
        'https://oidc.example.com/redirect-uri',
        { state: 'state-from-query' },
        { state: 'state-from-cookie' },
      );
    });
  });
});
