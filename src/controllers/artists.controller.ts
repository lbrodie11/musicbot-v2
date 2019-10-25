import { Controller, Post, Body, Get, Patch, Delete } from '@nestjs/common';
import { ArtistsService } from '../services/artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  async addArtist(
    @Body('artistName') artistName: string,
    @Body('albums') albums: [string],
  ) {
    const generatedId = await this.artistsService.insertArtist(
      artistName,
      albums,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllArtists() {
    const products = await this.artistsService.getArtists();
    return products;
  }

  @Get(':artistName')
  async getArtist(@Body('artistName') artistName: string) {
    return await this.artistsService.getSingleArtist(artistName);
  }

  @Patch(':artistName')
  async updateArtist(
    @Body('artistName') artistName: string,
    @Body('albums') albums: [string],
  ) {
    await this.artistsService.updateArtistAlbums(artistName, albums);
    return null;
  }

  @Delete(':artistName')
  async removeArtist(@Body('artistName') artistName: string) {
    await this.artistsService.deleteArtist(artistName);
    return null;
  }
}
