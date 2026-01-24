import Position from '../models/Position';
import EventRepository from '../repositories/EventRepository';
import ModelFactory from '../../test/ModelFactory';
import LocationRepository from '../repositories/LocationRepository';
import MoveShipTowardsDestinationUsecase from './moveShipTowardsDestinationUsecase';
import OrientationInDegrees from '../values/OrientationInDegrees';
import MailerService from '../services/MailerService';
import User from '../models/User';

describe('moveShipTowardsDestinationUsecase', () => {
  describe('when ship is not yet at destination', () => {
    test('it updates position and course towards destination', async () => {
      // given
      const currentPosition = new Position(1, 1);
      const destinationPosition = new Position(3, 4);
      const ship = ModelFactory.createShip({
        speed: 100,
        currentPosition,
        currentCourse: new OrientationInDegrees(0),
        destinationPosition,
      });
      const locationRepository = {
        findByPosition: jest.fn(() =>
          ModelFactory.createLocation({
            name: 'Mars',
            position: destinationPosition,
          }),
        ),
      } as unknown as LocationRepository;
      const eventRepository = {
        create: jest.fn(),
      } as unknown as EventRepository;
      const mailerService = {
        sendMailNotification: jest.fn().mockResolvedValue(undefined),
      } as unknown as MailerService;
      const moveShipTowardsDestinationUsecase =
        new MoveShipTowardsDestinationUsecase(
          locationRepository,
          eventRepository,
          mailerService,
        );

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase.execute(ship);

      // then
      expect(eventRepository.create).not.toHaveBeenCalled();
      expect(mailerService.sendMailNotification).not.toHaveBeenCalled();
      expect(updatedShip.currentPosition.x).toBe(1.0003707937837683);
      expect(updatedShip.currentPosition.y).toBe(1.0005561906756524);
      expect(updatedShip.currentCourse.value).toBe(33.7);
    });
  });

  describe('when ship is at destination', () => {
    test("it does not move ship and sets ship's location (exact position)", async () => {
      // given
      const currentPosition = new Position(23, 17);
      const destinationPosition = new Position(23, 17);
      const ship = ModelFactory.createShip({
        currentPosition,
        destinationPosition,
        currentCourse: new OrientationInDegrees(88),
      });
      const locationRepository = {
        findByPosition: jest.fn(() =>
          ModelFactory.createLocation({ code: 'mars', name: 'Mars' }),
        ),
      } as unknown as LocationRepository;
      const eventRepository = {
        create: jest.fn(),
      } as unknown as EventRepository;
      const mailerService = {
        sendMailNotification: jest.fn().mockResolvedValue(undefined),
      } as unknown as MailerService;
      const moveShipTowardsDestinationUsecase =
        new MoveShipTowardsDestinationUsecase(
          locationRepository,
          eventRepository,
          mailerService,
        );

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase.execute(ship);

      // then
      const destinationLocation = ModelFactory.createLocation({
        code: 'mars',
        name: 'Mars',
      });
      expect(eventRepository.create).toHaveBeenCalledWith(
        'has arrived at Mars ({23,17})',
        ship,
        destinationLocation,
      );
      expect(updatedShip.currentPosition.x).toBe(23);
      expect(updatedShip.currentPosition.y).toBe(17);
      expect(updatedShip.isStationary).toBe(true);
      expect(updatedShip.currentLocationCode).toBe('mars');
      expect(updatedShip.currentCourse).toStrictEqual(
        new OrientationInDegrees(88),
      );
    });

    test('it does not trigger arrival when ship is outside 0.1 SU tolerance', async () => {
      // given
      const destinationPosition = new Position(100, 200);
      // Ship is outside 0.1 SU tolerance
      const currentPosition = new Position(100.11, 200.08);
      // Distance: sqrt(0.11^2 + 0.08^2) ≈ 0.136 SU > 0.1 SU
      const ship = ModelFactory.createShip({
        currentPosition,
        destinationPosition,
        speed: 100,
      });
      const locationRepository = {
        findByPosition: jest.fn(() =>
          ModelFactory.createLocation({ code: 'mars', name: 'Mars' }),
        ),
      } as unknown as LocationRepository;
      const eventRepository = {
        create: jest.fn(),
      } as unknown as EventRepository;
      const mailerService = {
        sendMailNotification: jest.fn().mockResolvedValue(undefined),
      } as unknown as MailerService;
      const moveShipTowardsDestinationUsecase =
        new MoveShipTowardsDestinationUsecase(
          locationRepository,
          eventRepository,
          mailerService,
        );

      // when
      const updatedShip = await moveShipTowardsDestinationUsecase.execute(ship);

      // then
      expect(eventRepository.create).not.toHaveBeenCalled();
      expect(mailerService.sendMailNotification).not.toHaveBeenCalled();
      // Ship should continue moving (not snapped to destination)
      expect(updatedShip.isStationary).toBe(false);
      // Position should have changed from original
      expect(
        updatedShip.currentPosition.x !== currentPosition.x ||
          updatedShip.currentPosition.y !== currentPosition.y,
      ).toBe(true);
    });

    test('it sends mail notification when owner has enabled notifications', async () => {
      // given
      const currentPosition = new Position(23, 17);
      const destinationPosition = new Position(23, 17);
      const owner = new User(1, 'Test Pilot', 'pilot@example.com', true);
      const ship = ModelFactory.createShip({
        currentPosition,
        destinationPosition,
        owner,
      });
      const marsLocation = ModelFactory.createLocation({
        code: 'mars',
        name: 'Mars',
      });
      const locationRepository = {
        findByPosition: jest.fn(() => marsLocation),
      } as unknown as LocationRepository;
      const eventRepository = {
        create: jest.fn(),
      } as unknown as EventRepository;
      const mailerService = {
        sendMailNotification: jest.fn().mockResolvedValue(undefined),
      } as unknown as MailerService;
      const moveShipTowardsDestinationUsecase =
        new MoveShipTowardsDestinationUsecase(
          locationRepository,
          eventRepository,
          mailerService,
        );

      // when
      await moveShipTowardsDestinationUsecase.execute(ship);

      // then
      expect(mailerService.sendMailNotification).toHaveBeenCalledWith(
        ship,
        marsLocation,
      );
    });

    test('it does not send mail notification when owner has disabled notifications', async () => {
      // given
      const currentPosition = new Position(23, 17);
      const destinationPosition = new Position(23, 17);
      const owner = new User(1, 'Test Pilot', 'pilot@example.com', false);
      const ship = ModelFactory.createShip({
        currentPosition,
        destinationPosition,
        owner,
      });
      const locationRepository = {
        findByPosition: jest.fn(() =>
          ModelFactory.createLocation({ code: 'mars', name: 'Mars' }),
        ),
      } as unknown as LocationRepository;
      const eventRepository = {
        create: jest.fn(),
      } as unknown as EventRepository;
      const mailerService = {
        sendMailNotification: jest.fn().mockResolvedValue(undefined),
      } as unknown as MailerService;
      const moveShipTowardsDestinationUsecase =
        new MoveShipTowardsDestinationUsecase(
          locationRepository,
          eventRepository,
          mailerService,
        );

      // when
      await moveShipTowardsDestinationUsecase.execute(ship);

      // then
      expect(mailerService.sendMailNotification).not.toHaveBeenCalled();
    });
  });
});
