import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';

export default async function server() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  app.use(
    bodyParser.json({
      type: (req: any) =>
        req.get('Content-Type') === 'application/vnd.api+json',
      strict: false,
    }),
  );

  app.enableCors();
  await app.listen(3000);
}
