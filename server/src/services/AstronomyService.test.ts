import AstronomyService from './AstronomyService';
import Position from '../models/Position';

describe('AstronomyService', () => {
  describe('getPositionFor', () => {
    it('returns position for location code', async () => {
      // given
      const service = new AstronomyService();

      // when
      const position = await service.getPositionFor('sun');

      // then
      expect(position).toStrictEqual(new Position(0, 0));
    });

    it('returns position for location code and date', async () => {
      // given
      const service = new AstronomyService();

      // when
      const date = new Date('2019-04-28T02:42:00Z');
      const position = await service.getPositionFor('earth', date);

      // then
      expect(position).toStrictEqual(
        new Position(-800.9525455975981, -609.7676148147503),
      );
    });
  });
});
