import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument, UpdateArtistAlbumInput, CreateArtistInput } from './artist.schema';

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name);
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) { }


  // Queries

  async getArtists() {
    return this.artistModel.find().lean();
  }

  async findById(id: string) {
    return this.artistModel.findById(id).lean();
  }

  async getAlbumNames() {
    const artists = await this.artistModel.find().lean();
    const albumNames = artists.map(artist => artist.albumName);
    return albumNames;
  }

  async getAlbumIds() {
    const artists = await this.artistModel.find().exec();
    const albumIds = artists.map(artist => artist.albumId);
    return albumIds;
  }

  async getArtistNames() {
    const artists = await this.artistModel.find().exec();
    const artistNames = artists.map(artist => artist.artistName);
    return artistNames;
  }

  async getArtistIds() {
    const artists = await this.artistModel.find().exec();
    const artistIds = artists.map(artist => artist.artistId);
    return artistIds;
  }


  // Mutations

  async createArtist(input: CreateArtistInput) {
    return this.artistModel.create(input)
  }

  async updateArtistAlbum(input: UpdateArtistAlbumInput, artistId: string) {
    const { albumName, albumId } = input
    return await this.artistModel
      .findOneAndUpdate({ artistId }, { albumName, albumId }, { new: true })
      .exec();
  }

  async removeArtist(artistId: string) {
    const result = await this.artistModel
      .findOneAndDelete({
        artistId,
      })
      .exec();
    if (!result) {
      throw new NotFoundException('Could not find Artist');
    }
  }
}
