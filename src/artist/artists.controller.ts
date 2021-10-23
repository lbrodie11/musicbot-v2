import { Controller, Post, Body, Get, Patch, Delete } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistService) { }

  // @Post()
  // async addArtist(
  //   @Body('artistName') artistName: string,
  //   @Body('album') album: string,
  // ) {
  //   const generatedId = await this.artistsService.insertArtist(
  //     artistName,
  //     album,
  //   );
  //   return { id: generatedId };
  // }

  @Get()
  async getAllArtists() {
    const products = await this.artistsService.getArtists();
    return products;
  }

  @Get(':artistId')
  async getArtist(@Body('artistName') artistId: string) {
    return await this.artistsService.findById(artistId);
  }

  // @Patch(':artistName')
  // async updateArtist(
  //   @Body('artistName') artistName: string,
  //   @Body('albums') albums: [string],
  // ) {
  //   await this.artistsService.updateArtistAlbums(artistName, albums);
  //   return null;
  // }

  @Delete(':artistName')
  async removeArtist(@Body('artistName') artistId: string) {
    await this.artistsService.removeArtist(artistId);
    return null;
  }
}
