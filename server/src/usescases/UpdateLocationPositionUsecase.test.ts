import UpdateLocationPositionUsecase from './UpdateLocationPositionUsecase';
import AstronomyService from '../services/AstronomyService';
import Position from '../models/Position';
import Location from '../models/Location';
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

    const usecase = new UpdateLocationPositionUsecase(
      astronomyService,
      shipRepository,
    );
    const location = new Location('earth', 'Earth', currentPosition);

    // when
    await usecase.execute(location);

    // then
    expect(location.position).toStrictEqual(new Position(3, 4));
    expect(astronomyService.getPositionFor).toHaveBeenCalledWith('earth');
    expect(shipRepository.getAllAtLocation).toHaveBeenCalledWith(location);
    expect(shipRepository.update).toHaveBeenCalledWith(
      ModelFactory.createShip({ currentPosition: newPosition }),
    );
  });
});
