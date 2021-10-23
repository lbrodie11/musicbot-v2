import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Artist } from './artist.schema';
import { CreateArtistInput, UpdateArtistAlbumInput } from './artist.schema'
import { ArtistService } from './artist.service';

@Resolver(() => Artist)
export class ArtistsResolver {
  constructor(
    private artistService: ArtistService
  ) { }

  @Query(() => [Artist])
  async artists(): Promise<Artist[]> {
    return await this.artistService.getArtists();
  }

  @Query(() => Artist)
  async artist(@Args('artistId', { type: () => String }) artistId: string) {
    return await this.artistService.findById(artistId);
  }

  @Query()
  async artistsCount() {
    return await this.artistService.getArtistsCount();
  }

  @Mutation(() => Artist)
  async createArtist(@Args('input') input: CreateArtistInput) {
    return this.artistService.createArtist(input)
  }

  @Mutation(() => Artist)
  async updateArtistAlbum(@Args('artistId') artistId: string,
    @Args('input') input: UpdateArtistAlbumInput) {
    return this.artistService.updateArtistAlbum(input, artistId)
  }
}