import { PrismaClient } from '@prisma/client';

import server from './src/server';
import ShipRepository from './src/repositories/ShipRepository';
import EventRepository from './src/repositories/EventRepository';
import LocationRepository from './src/repositories/LocationRepository';
import moveShipTowardsDestinationUsecase from './src/usescases/moveShipTowardsDestinationUsecase';

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
  setInterval(tick, 1000);

  await server();
}

async function tick() {
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
