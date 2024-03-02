import AuthenticationGuard from './AuthenticationGuard';
import AuthenticationMethodRepository from '../repositories/AuthenticationMethodRepository';
import { ExecutionContext } from '@nestjs/common';
import { JsonApiError } from '../errors';
import SessionToken from '../models/SessionToken';

describe('AuthenticationGuard', () => {
  describe('when there is no authentication method id in session', () => {
    it('throws an JsonApiError', () => {
      // given
      const authenticationMethodRepository = {
        findById: jest.fn().mockReturnValue(false),
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
      expect(authenticationMethodRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('when authentication method does not exist for given id', () => {
    it('throws an JsonApiError', () => {
      // given
      const authenticationMethodRepository = {
        findById: jest.fn().mockReturnValue(null),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: (): { session: SessionToken } => ({
            session: new SessionToken({ sub: 1, duration: 0 }),
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const tested = () => guard.canActivate(context);

      // then
      expect(tested).toThrow(JsonApiError);
      expect(tested).toThrow('Unknown authentication method');
      expect(authenticationMethodRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('when session was erased', () => {
    it('throws an JsonApiError', () => {
      // given
      const authenticationMethodRepository = {
        findById: jest.fn().mockReturnValue(false),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: (): { session: SessionToken } => ({
            session: new SessionToken({ sub: null }),
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const tested = () => guard.canActivate(context);

      // then
      expect(tested).toThrow(JsonApiError);
      expect(tested).toThrow('Unknown authentication method');
      expect(authenticationMethodRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('when expiresAt is in the past', () => {
    it('throws an JsonApiError', () => {
      // given
      const authenticationMethodRepository = {
        findById: jest.fn().mockReturnValue(true),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: (): { session: SessionToken } => ({
            session: new SessionToken({ sub: 1, duration: 0 }),
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const tested = () => guard.canActivate(context);

      // then
      expect(tested).toThrow(JsonApiError);
      expect(tested).toThrow('Session is expired');
      expect(authenticationMethodRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('when authentication method exists for given id', () => {
    it('returns true', () => {
      // given
      const authenticationMethodRepository = {
        findById: jest.fn().mockReturnValue(true),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: (): { session: SessionToken } => ({
            session: new SessionToken({ sub: 1 }),
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const result = guard.canActivate(context);

      // then
      expect(authenticationMethodRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });
});
