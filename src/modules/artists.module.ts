import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsController } from '../controllers/artists.controller';
import { ArtistsService } from '../services/artists.service';
import { TwitterApiService } from '../services/twitter.api.service';
import { ArtistSchema } from '../schemas/artists.schema';
import { ArtistsResolver } from '../resolvers/artists.resolver';
import { SpotifyService } from '../services/spotify.service';
import { TwitterService } from '../services/twitter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Artist', schema: ArtistSchema }]),
  ],
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    ArtistsResolver,
    TwitterApiService,
    SpotifyService,
    TwitterService,
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
