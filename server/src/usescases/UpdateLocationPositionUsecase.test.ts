import UpdateLocationPositionUsecase from './UpdateLocationPositionUsecase';
import AstronomyService from '../services/AstronomyService';
import Position from '../models/Position';
import Location from '../models/Location';

describe('UpdateLocationPositionUsecase', () => {
  it("updates a location's position", async () => {
    // given
    const astronomyService = {
      getPositionFor: () => new Position(3, 4),
    } as unknown as AstronomyService;
    const usecase = new UpdateLocationPositionUsecase(astronomyService);
    const location = new Location('earth', 'Earth', new Position(1, 2));

    // when
    await usecase.execute(location);

    // then
    expect(location.position).toStrictEqual(new Position(3, 4));
  });
});
