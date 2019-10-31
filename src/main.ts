import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
const getSpotifyToken = require('./services/facebooklogin')
require('newrelic')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  Logger.log(`Server listening on port ${process.env.PORT}`);
  getSpotifyToken()
  Logger.log('Logged in to Facebook');
}
bootstrap();
