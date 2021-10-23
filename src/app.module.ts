import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuppeteerModule } from 'nest-puppeteer'
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { ArtistModule } from './artist/artist.module';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ReleaseService } from './services/release.service';
import { SpotifyService } from './services/spotify.service';
import { TwitterService } from './services/twitter.service';
import { TwitterApiService } from './services/twitter.api.service';
import { AppService } from './app.service';
import { join } from 'path';
// import './config/env';
// const { DB_URL, DB_USER, DB_PASSWORD } = process.env;

@Module({
  imports: [
    // AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    PuppeteerModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ArtistModule
  ],
  controllers: [AppController],
  providers: [
    ReleaseService,
    SpotifyService,
    TwitterService,
    TwitterApiService,
    AppService
  ],
})
export class AppModule {}
