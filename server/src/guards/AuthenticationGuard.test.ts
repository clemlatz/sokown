import AuthenticationGuard from './AuthenticationGuard';
import AuthenticationMethodRepository, {
  AuthenticationMethodDTO,
} from '../repositories/AuthenticationMethodRepository';
import { ExecutionContext } from '@nestjs/common';
import { JsonApiError } from '../errors';
import SessionToken from '../models/SessionToken';

describe('AuthenticationGuard', () => {
  describe('when there is no authentication method id in session', () => {
    it('throws an JsonApiError', async () => {
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
      const expectedError = new JsonApiError(
        401,
        'Unknown authentication method',
      );
      await expect(tested).rejects.toStrictEqual(expectedError);
      expect(authenticationMethodRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('when authentication method does not exist for given id', () => {
    it('throws an JsonApiError', async () => {
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
      const expectedError = new JsonApiError(
        401,
        'Unknown authentication method',
      );
      await expect(tested).rejects.toStrictEqual(expectedError);
      expect(authenticationMethodRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('when authentication method exists but has no user', () => {
    it('throws an JsonApiError', async () => {
      // given
      const givenAuthMethod: AuthenticationMethodDTO = {
        id: 1,
        externalId: 'external-id',
        idTokenClaims: {
          email: 'user@example.net',
          username: 'name',
        },
        user: null,
      };
      const authenticationMethodRepository = {
        findById: jest.fn().mockReturnValue(givenAuthMethod),
      } as unknown as AuthenticationMethodRepository;
      const guard = new AuthenticationGuard(authenticationMethodRepository);

      const context = {
        switchToHttp: () => ({
          getRequest: (): { session: SessionToken } => ({
            session: new SessionToken({ sub: 1, duration: 1 }),
          }),
        }),
      } as unknown as ExecutionContext;

      // when
      const tested = () => guard.canActivate(context);

      // then
      const expectedError = new JsonApiError(
        401,
        'Unknown authentication method',
      );
      await expect(tested).rejects.toStrictEqual(expectedError);
      expect(authenticationMethodRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('when session was erased', () => {
    it('throws an JsonApiError', async () => {
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
      const expectedError = new JsonApiError(
        401,
        'Unknown authentication method',
      );
      await expect(tested).rejects.toStrictEqual(expectedError);
      expect(authenticationMethodRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('when expiresAt is in the past', () => {
    it('throws an JsonApiError', async () => {
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
      const expectedError = new JsonApiError(401, 'Session is expired');
      await expect(tested).rejects.toStrictEqual(expectedError);
      expect(authenticationMethodRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('when authentication method and user exists for given id', () => {
    it('returns true', async () => {
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
      const result = await guard.canActivate(context);

      // then
      expect(authenticationMethodRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });
});
