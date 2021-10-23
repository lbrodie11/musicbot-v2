import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsController } from '../controllers/artists.controller';
import { ArtistService } from './artist.service';
import { TwitterApiService } from '../services/twitter.api.service';
import { Artist, ArtistSchema } from './artist.schema';
import { ArtistsResolver } from './artist.resolver';
import { SpotifyService } from '../services/spotify.service';
import { TwitterService } from '../services/twitter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema }
    ]),
  ],
  controllers: [ArtistsController],
  providers: [
    ArtistService,
    ArtistsResolver,
    TwitterApiService,
    SpotifyService,
    TwitterService,
  ],
  exports: [ArtistService]
})
export class ArtistModule {}
