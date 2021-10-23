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

  async findById(id: string) {
    return this.artistModel.findById(id).lean();
  }

  async getArtists() {
    return this.artistModel.find().lean();
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



  async getArtistsCount(): Promise<any> {
    await this.artistModel.countDocuments();
  }

  async getAlbumNames() {
    const artists = await this.artistModel.find().exec();
    const albumNames = artists.map(artist => artist.albumName);
    return albumNames;
  }

  async getAlbumIds() {
    const artists = await this.artistModel.find().exec();
    const albumIds = artists.map(artist => artist.albumId); /// Figure out how to get album ids
    return albumIds;
  }

  // async createArtist(insertArtistDto: CreateArtistInput) {
  //   const newArtist = new this.artistModel(insertArtistDto);
  //   return await newArtist.save();
  // }

  // async getArtistNames() {
  //   const artists = await this.artistModel.find().exec();
  //   const artistNames = artists.map(artist => artist.artistName);
  //   return artistNames;
  // }

  async getArtistNames() {
    const artists = await this.artistModel.find().exec();
    const artistNames = artists.map(artist => ({
      artistName: artist.artistName,
    }));
    return artistNames;
  }

  async getArtistIds() {
    const artists = await this.artistModel.find().exec();
    const artistIds = artists.map(artist => artist.artistId);
    return artistIds;
  }

  async getSingleArtist(artistId: string) {
    const artist = await this.findArtist(artistId);
    return {
      artistId: artist.artistId,
      artistName: artist.artistName,
      albumId: artist.albumId,
      albumName: artist.albumName,
    };
  }



  async deleteArtist(artistName: string) {
    this.removeArtist(artistName);
  }

  // async removeArtistLastAlbum(artistName: string) {
  //   try {
  //     this.logger.warn('Remove artist last album: ', artistName);
  //     const artist = await this.findArtist(artistName);
  //     const [...albums] = artist.albums;
  //     await this.findArtistAndUpdate(artistName, albums);
  //     this.logger.warn('Remove artist last album: ', albums[0]);
  //   } catch (err) {
  //     this.logger.error('Remove artist last album failed', err);
  //   }
  // }

  // async removeAllArtistData(){
  //   try {
  //     winston.warn('Remove all artist data')
  //     const artists = await this.getArtists()
  //     for (let artist of artists) {
  //       winston.warn('Removing artist data', artist);
  //       await this.removeArtist(artist);
  //     }
  //     winston.warn('Removed data of all', artist.length, 'artists');
  //   } catch (err) {
  //     winston.error('Remove all artist data failed', err)
  //   }
  // }

  // helper functions
  private async findArtist(artistId: string): Promise<ArtistDocument> {
    let artist;
    try {
      artist = await this.artistModel.findOne({ artistId }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find Artist');
    }
    if (!artist) {
      throw new NotFoundException('Could not find Artist');
    }
    return artist;
  }

  // private async findArtistAndUpdate(artistId, albumId, albumName) {
  //   const updatedArtist = await this.artistModel
  //     .findOneAndUpdate({ artistId }, { albumId, albumName }, { new: true })
  //     .exec();
  //   // if (artistId) {
  //   //   updatedArtist.artistName = artistName;
  //   //   updatedArtist.artistId = artistId
  //   // }
  //   // if (albumId) {
  //   //   updatedArtist.albumName = albumName;
  //   //   updatedArtist.albumId = albumId;
  //   // }
  //   updatedArtist.save();
  // }

  private async removeArtist(artistName: string) {
    const result = await this.artistModel
      .findOneAndDelete({
        artistName,
      })
      .exec();
    if (!result) {
      throw new NotFoundException('Could not find Artist');
    }
  }
}
