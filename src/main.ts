import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { json } from 'express';
import { initializeSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //secure app by setting HTTP response headers
  app.use(helmet());

  //validation pipeline
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(json({ limit: '100kb' }));
  initializeSwagger(app);
  await app.listen(8080);
}
bootstrap();
