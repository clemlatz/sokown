import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export default async function server() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
