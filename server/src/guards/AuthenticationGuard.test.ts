import AuthenticationGuard from './AuthenticationGuard';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import { ExecutionContext } from '@nestjs/common';
import { JsonApiError } from '../errors';

describe('AuthenticationGuard', () => {
  describe('when there is no authentication method id in session', () => {
    it('throws an JsonApiError', () => {
      // given
      const authenticationMethodRepository = {
        existsById: jest.fn().mockReturnValue(false),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ session: {} }),
        }),
      } as unknown as ExecutionContext;

      // when
      const tested = () => guard.canActivate(context);

      // then
      expect(tested).toThrow(JsonApiError);
      expect(tested).toThrow('Unknown authentication method');
      expect(authenticationMethodRepository.existsById).not.toHaveBeenCalled();
    });
  });

  describe('when authentication method does not exist for given id', () => {
    it('throws an JsonApiError', () => {
      // given
      const authenticationMethodRepository = {
        existsById: jest.fn().mockReturnValue(false),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            session: { authenticationMethodId: 1, expiresAt: 1 },
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const tested = () => guard.canActivate(context);

      // then
      expect(tested).toThrow(JsonApiError);
      expect(tested).toThrow('Unknown authentication method');
      expect(authenticationMethodRepository.existsById).toHaveBeenCalledWith(1);
    });
  });

  describe('when expiresAt is in the past', () => {
    it('throws an JsonApiError', () => {
      // given
      const authenticationMethodRepository = {
        existsById: jest.fn().mockReturnValue(true),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            session: { authenticationMethodId: 1, expiresAt: 1 },
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const tested = () => guard.canActivate(context);

      // then
      expect(tested).toThrow(JsonApiError);
      expect(tested).toThrow('Session is expired');
      expect(authenticationMethodRepository.existsById).toHaveBeenCalledWith(1);
    });
  });

  describe('when authentication method exists for given id', () => {
    it('returns true', () => {
      // given
      const authenticationMethodRepository = {
        existsById: jest.fn().mockReturnValue(true),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const expiresAtTimestamp = new Date('2048-01-01').getTime();
      const expiresAtClaim = expiresAtTimestamp / 1000;

      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            session: {
              authenticationMethodId: 1,
              expiresAt: expiresAtClaim,
            },
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const result = guard.canActivate(context);

      // then
      expect(authenticationMethodRepository.existsById).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });
});
