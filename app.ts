import {PrismaClient} from '@prisma/client'
import ShipRepository from "./src/repositories/ShipRepository";
import moveShipTowardsDestinationUsecase from "./src/usescases/moveShipTowardsDestinationUsecase";

const prisma = new PrismaClient()
const shipRepository = new ShipRepository(prisma);

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
}

async function tick() {
  const ships = await shipRepository.getShipsWithDestination();
  for (const ship of ships) {
    const updatedShip = await moveShipTowardsDestinationUsecase(ship, console.log);
    await shipRepository.update(updatedShip);
  }
}
