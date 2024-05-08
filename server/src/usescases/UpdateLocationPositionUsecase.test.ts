import UpdateLocationPositionUsecase from './UpdateLocationPositionUsecase';
import AstronomyService from '../services/AstronomyService';
import Position from '../models/Position';
import ShipRepository from '../repositories/ShipRepository';
import ModelFactory from '../../test/ModelFactory';

describe('UpdateLocationPositionUsecase', () => {
  it("updates a location's and ships at that location's positions", async () => {
    // given
    const currentPosition = new Position(1, 2);
    const newPosition = new Position(3, 4);
    const astronomyService = {
      getPositionFor: jest.fn().mockResolvedValue(newPosition),
    } as unknown as AstronomyService;
    const shipAtLocation = ModelFactory.createShip({ currentPosition });
    const shipRepository = {
      getAllAtLocation: jest.fn().mockResolvedValue([shipAtLocation]),
      update: jest.fn(),
    } as unknown as ShipRepository;
    const location = ModelFactory.createLocation({
      code: 'earth',
      name: 'Earth',
      position: currentPosition,
      primaryBody: ModelFactory.createLocation({
        position: new Position(0, 0),
      }),
      distanceFromPrimaryBody: 5,
    });
    const usecase = new UpdateLocationPositionUsecase(
      astronomyService,
      shipRepository,
    );

    // when
    await usecase.execute(location);

    // then
    expect(location.position).toStrictEqual(new Position(3, 4));
    expect(location.distanceFromPrimaryBody.value).toStrictEqual(5);
    expect(astronomyService.getPositionFor).toHaveBeenCalledWith('earth');
    expect(shipRepository.getAllAtLocation).toHaveBeenCalledWith(location);
    expect(shipRepository.update).toHaveBeenCalledWith(
      ModelFactory.createShip({ currentPosition: newPosition }),
    );
  });
});
