import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module'
// import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ReleaseService } from './services/release.service';
import { SpotifyService } from './services/spotify.service';
import { TwitterService } from './services/twitter.service';
import { TwitterApiService } from './services/twitter.api.service';
import { AppService } from './app.service';
import { join } from 'path';
import './config/env';
import { AlbumResolver } from './album/album.resolver';
const { DB_URL, DB_USER, DB_PASSWORD } = process.env;

@Module({
  imports: [
    // AuthModule,
    MongooseModule.forRoot(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ArtistModule,
    AlbumModule,
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
