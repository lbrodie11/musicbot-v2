import { Resolver, Query, Args } from '@nestjs/graphql';
import { Artist } from '../dtos/artists.dto';
import { ArtistsService } from '../services/artists.service';
import { ArtistNames } from '../dtos/artistNames.dto';
import { AlbumNames } from '../dtos/albumNames.dto';

@Resolver()
export class ArtistsResolver {
  constructor(private readonly artistsService: ArtistsService) {}

  @Query(() => [Artist])
  async artists() {
    return await this.artistsService.getArtists();
  }

  @Query(() => [ArtistNames])
  async artistNames() {
    return await this.artistsService.getArtistNames();
  }

  @Query(() => [AlbumNames])
  async albumNames() {
    return await this.artistsService.getAlbumNames();
  }

  @Query(() => Artist)
  async artist(@Args('artistName') artistName: string) {
    return await this.artistsService.getSingleArtist(artistName);
  }
}
