import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsController } from '../controllers/artists.controller';
import { ArtistService } from './artist.service';
import { AlbumService } from 'src/album/album.service';
import { TwitterApiService } from '../services/twitter.api.service';
import { ArtistType, ArtistSchema } from './artist.schema';
import { AlbumType, AlbumSchema } from '../album/album.schema';
import { ArtistsResolver } from './artist.resolver';
import { SpotifyService } from '../services/spotify.service';
import { TwitterService } from '../services/twitter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArtistType.name, schema: ArtistSchema },
      { name: AlbumType.name, schema: AlbumSchema },
    ]),
  ],
  controllers: [ArtistsController],
  providers: [
    ArtistService,
    ArtistsResolver,
    AlbumService,
    TwitterApiService,
    SpotifyService,
    TwitterService,
  ],
  exports: [ArtistService]
})
export class ArtistModule {}
