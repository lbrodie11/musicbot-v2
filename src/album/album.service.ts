import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlbumDocument, AlbumType, CreateAlbumInput } from '../album/album.schema'

@Injectable()
export class AlbumService {
  constructor(@InjectModel(AlbumType.name) private albumModel: Model<AlbumDocument>) {}

  async findMany() {
    return await this.albumModel.find().lean();
  }

  async findById(id) {
    return await this.albumModel.findById(id).lean();
  }

  async findByArtistId(artistId) {
    return await this.albumModel.find({ artist: artistId });
  }

  async createAlbum(album: CreateAlbumInput) {
    return await this.albumModel.create(album);
  }

  // async insertArtist(insertArtistDto: CreateArtistInput) {
  //   const newArtist = new this.artistModel(insertArtistDto);
  //   return await newArtist.save();
  // }

  // async createAlbum(createAlbumDto: AlbumInput) {
  //   const newAlbum = new this.artistModel(createAlbumDto);
  //   return await newAlbum.save();
  // }

  // async findByArtistId(artistId) {
  //   return this.artistModel.find({ artist: artistId });
  // }

  // async getArtists() {
  //   const artists = await this.artistModel.find().exec();
  //   return artists.map(artist => ({
  //     id: artist.id,
  //     artistName: artist.name,
  //     albums: artist.albums,
  //   }));
  // }

  // async getArtistsCount(): Promise<any> {
  //   await this.artistModel.countDocuments();
  // }

  // async getAlbums() {
  //   const artists = await this.artistModel.find().exec();
  //   const albums = artists.map(artist => artist.albums);
  //   return albums;
  // }

  // async getArtistNames() {
  //   const artists = await this.artistModel.find().exec();
  //   const artistNames = artists.map(artist => artist.artistName);
  //   return artistNames;
  // }

  // Need to add these for GRAPHQL
  // async getAlbumNames() {
  //   const artists = await this.artistModel.find().exec();
  //   const albumNames = artists.map(artist => ({
  //     albums: artist.albums,
  //   }));
  //   return albumNames;
  // }

  // async getArtistNames() {
  //   const artists = await this.artistModel.find().exec();
  //   const artistNames = artists.map(artist => ({
  //     artistName: artist.artistName,
  //   }));
  //   return artistNames;
  // }

  // async getSingleArtist(artistName: string) {
  //   const artist = await this.findArtist(artistName);
  //   return {
  //     id: artist.id,
  //     artistName: artist.name,
  //     albums: artist.albums,
  //   };
  // }

  // async updateArtistAlbums(artistName: string, albums: [string]) {
  //   this.findArtistAndUpdate(artistName, albums);
  // }

  // async deleteArtist(artistName: string) {
  //   this.removeArtist(artistName);
  // }

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
  // private async findArtist(artistName: string): Promise<ArtistDocument> {
  //   let artist;
  //   try {
  //     artist = await this.artistModel.findOne({ artistName }).exec();
  //   } catch (error) {
  //     throw new NotFoundException('Could not find Artist');
  //   }
  //   if (!artist) {
  //     throw new NotFoundException('Could not find Artist');
  //   }
  //   return artist;
  // }

  // private async findArtistAndUpdate(artistName: string, albums: [string]) {
  //   const updatedArtist = await this.artistModel
  //     .findOneAndUpdate({ artistName }, { albums }, { new: true })
  //     .exec();
  //   if (artistName) {
  //     updatedArtist.name = artistName;
  //   }
  //   if (albums) {
  //     updatedArtist.albums = albums;
  //   }
  //   updatedArtist.save();
  // }

  // private async removeArtist(artistName: string) {
  //   const result = await this.artistModel
  //     .findOneAndDelete({
  //       artistName,
  //     })
  //     .exec();
  //   if (!result) {
  //     throw new NotFoundException('Could not find Artist');
  //   }
  // }
}
