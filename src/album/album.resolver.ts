import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { AlbumType, CreateAlbumInput, FindAlbumInput  } from './album.schema';
import { AlbumService } from './album.service';
import { ArtistService } from '../artist/artist.service'

@Resolver(() => AlbumType)
export class AlbumResolver {
  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService
  ){}

  @Query(() => [AlbumType])
  async albums(): Promise<AlbumType[]> {
    console.log(this.albumService.findMany())
    return this.albumService.findMany();
  }

  @Query(() => AlbumType)
  async album(@Args('input') { _id }: FindAlbumInput) {
    return this.albumService.findById(_id);
  }

  @Mutation(() => AlbumType, { nullable: true })
  async createAlbum(@Args('input') album: CreateAlbumInput) {
    return this.albumService.createAlbum(album)
  }

  @ResolveField(() => AlbumType)
  async artist(@Parent() album: AlbumType) {
    return this.artistService.findByArtistId(album.artist);
  }
}
