import SessionToken from './SessionToken';

describe('SessionToken', () => {
  describe('writeTo', () => {
    it('writes to target', () => {
      // given
      const sessionToken = new SessionToken({ sub: 1 });
      const targetSession = { sub: null };

      // when
      sessionToken.writeTo(targetSession);

      // then
      expect(targetSession.sub).toEqual(1);
    });
  });
});
