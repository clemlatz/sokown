import { PrismaClient } from '@prisma/client';

import server from './src/server';
import ShipRepository from './src/repositories/ShipRepository';
import EventRepository from './src/repositories/EventRepository';
import LocationRepository from './src/repositories/LocationRepository';
import moveShipTowardsDestinationUsecase from './src/usescases/moveShipTowardsDestinationUsecase';
import UpdateLocationPositionUsecase from './src/usescases/UpdateLocationPositionUsecase';
import AstronomyService from './src/services/AstronomyService';

const prisma = new PrismaClient();
const shipRepository = new ShipRepository(prisma);
const locationRepository = new LocationRepository();
const eventRepository = new EventRepository(prisma);

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function main() {
  await everySecond();
  await everyMinute();
  await server();

  setInterval(everySecond, 1000);
  setInterval(everyMinute, 60000);
}

async function everySecond(): Promise<void> {
  const ships = await shipRepository.getShipsWithDestination();
  for (const ship of ships) {
    const updatedShip = await moveShipTowardsDestinationUsecase(
      ship,
      locationRepository,
      eventRepository,
    );
    await shipRepository.update(updatedShip);
  }
}

const astronomyService = new AstronomyService();
const updateLocationPositionUsecase = new UpdateLocationPositionUsecase(
  astronomyService,
  shipRepository,
);
async function everyMinute(): Promise<void> {
  const locations = locationRepository.getAll();
  for (const location of locations) {
    await updateLocationPositionUsecase.execute(location);
  }
}
