import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { ArtistType } from './artist.schema';
import { CreateArtistInput } from './artist.schema'
import { ArtistService } from './artist.service';
import { AlbumService } from '../album/album.service';

@Resolver(() => ArtistType)
export class ArtistsResolver {
  constructor(
    private artistService: ArtistService, 
    private albumService: AlbumService
  ) {}

  @Query(() => [ArtistType])
  async artists(): Promise<ArtistType[]> {
    console.log(await this.artistService.findMany())
    return await this.artistService.findMany();
  }

  @Query(() => ArtistType)
  async artist(@Args('artistName', { type: () => String }) artistName: string) {
    return await this.artistService.getSingleArtist(artistName);
  }

  @Mutation(() => ArtistType)
  async createArtist(@Args('input') input: CreateArtistInput) {
    return this.artistService.createArtist(input)
  }

  @ResolveField()
  async albums(@Parent() parent: ArtistType) {
    return this.albumService.findByArtistId(parent._id);
  }
}