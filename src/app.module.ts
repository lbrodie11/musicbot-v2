import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ArtistsModule } from './modules/artists.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ReleaseService } from './services/release.service';
import { SpotifyService } from './services/spotify.service';
import { TwitterService } from './services/twitter.service';
import { TwitterApiService } from './services/twitter.api.service';
import { AppService } from './app.service';
import { join } from 'path';
import './config/env';
const { DB_URL, DB_USER, DB_PASSWORD } = process.env;

@Module({
  imports: [
    AuthModule,
    ArtistsModule,
    MongooseModule.forRoot(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    }),
  ],
  controllers: [AppController],
  providers: [
    ReleaseService,
    SpotifyService,
    TwitterService,
    TwitterApiService,
    AppService,
  ],
})
export class AppModule {}
