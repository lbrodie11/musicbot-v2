import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsController } from '../controllers/artists.controller';
import { AlbumService } from './album.service';
import { TwitterApiService } from '../services/twitter.api.service';
import { ArtistType, ArtistSchema } from '../artist/artist.schema';
import { AlbumType, AlbumSchema } from './album.schema';
import { AlbumResolver } from './album.resolver';
import { SpotifyService } from '../services/spotify.service';
import { TwitterService } from '../services/twitter.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArtistType.name, schema: ArtistSchema },
      { name: AlbumType.name, schema: AlbumSchema },
    ]),
  ],
  controllers: [ArtistsController],
  providers: [
    AlbumService,
    AlbumResolver,
    ArtistService,
    TwitterApiService,
    SpotifyService,
    TwitterService,
  ],
  exports: [AlbumService]
})
export class AlbumModule {}
