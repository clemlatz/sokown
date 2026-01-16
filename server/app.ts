import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as nodemailer from 'nodemailer';

import server from './src/server';
import ShipRepository from './src/repositories/ShipRepository';
import EventRepository from './src/repositories/EventRepository';
import LocationRepository from './src/repositories/LocationRepository';
import MoveShipTowardsDestinationUsecase from './src/usescases/moveShipTowardsDestinationUsecase';
import UpdateLocationPositionUsecase from './src/usescases/UpdateLocationPositionUsecase';
import AstronomyService from './src/services/AstronomyService';
import MailerService from './src/services/MailerService';

const prisma = new PrismaClient();
const shipRepository = new ShipRepository(prisma);
const locationRepository = new LocationRepository();
const eventRepository = new EventRepository(prisma);

const mailerTransportOptions: nodemailer.TransportOptions = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASSWORD
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined,
};
const mailerTransporter = nodemailer.createTransport(mailerTransportOptions);
const mailerService = new MailerService(mailerTransporter);

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
  const moveShipTowardsDestinationUsecase =
    new MoveShipTowardsDestinationUsecase(
      locationRepository,
      eventRepository,
      mailerService,
    );
  for (const ship of ships) {
    const updatedShip = await moveShipTowardsDestinationUsecase.execute(ship);
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
