import { Injectable, Logger } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import moment from 'moment';
import SpotifyWebApi from 'spotify-web-api-node';
import { find, size, toString, indexOf } from 'lodash';
import '../config/env';

interface Response<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

@Injectable()
export class SpotifyService {
  private spotifyApi: SpotifyWebApi;
  private readonly logger = new Logger(SpotifyService.name);
  constructor(private readonly artistsService: ArtistsService) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: `${process.env.SPOTIFY_CLIENT_ID}`,
      clientSecret: `${process.env.SPOTIFY_CLIENT_SECRET}`,
      redirectUri: `${process.env.SPOTIFY_REDIRECT_URI}`,
    });
  }

  // refactor for async
  async refreshToken() {
    let lastRefresh: moment.MomentInput;
    if (!lastRefresh || moment(lastRefresh).add(30, 'minutes') <= moment()) {
      try {
        const data = await this.spotifyApi.refreshAccessToken();
        lastRefresh = moment();
        this.logger.log('The access token has been refreshed!');
        this.setAccessToken(data.body.access_token);
      } catch (err) {
        this.logger.log('Could not refresh access token', err);
      }
    }
    return new Promise(r => r());
  }

  async setAccessToken(token: any) {
    this.spotifyApi.setAccessToken(token);
  }

  async setRefreshToken(token: any) {
    this.spotifyApi.setRefreshToken(token);
  }

  async createAuthorizeURL(scopes: any, state: any) {
    return this.spotifyApi.createAuthorizeURL(scopes, state);
  }

  // @ts-ignore
  async authorizationCodeGrant(code: string): Promise<Response<any>> {
    return await this.spotifyApi.authorizationCodeGrant(code);
  }

  async getAccessToken() {
    this.spotifyApi.getAccessToken();
  }

  // convert to async
  getArtists() {
    this.spotifyApi
      .getUserPlaylists()
      .then(data => {
        data.body.items.forEach(item => item);
      })
      .then(data => data)
      .catch(err => err);
  }

  async getFollowedArtists(after?: any) {
    const limit = 50;

    const response = await this.spotifyApi.getFollowedArtists({ limit, after });
    const nextAfter = response.body.artists.cursors.after;
    const artists = response.body.artists.items;

    if (nextAfter) {
      return [].concat(artists, await this.getFollowedArtists(nextAfter));
    }
    return artists;
  }

  async getFeaturedPlaylists() {
    await this.spotifyApi.getFeaturedPlaylists();
  }

  async getUser() {
    await this.spotifyApi.getMe();
  }

  async getArtistAlbums(artistId: string): Promise<any> {
    const albums = await this.spotifyApi.getArtistAlbums(artistId, {
      include_groups: 'album,single,compilation',
      limit: 1,
      country: 'US',
    });
    return albums;
  }

  async getNewReleases(
    artistIds: any,
    artistsNames: string[] | ArrayLike<string>,
    albumNames: any,
  ) {
    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));
    const newReleases = [];
    const artists = await this.artistsService.getArtists();
    const artistsSize = size(artists);
    this.logger.log(`Database currently contains ${artistsSize} artists`);
    for (let i = 0; i < artistIds.length; i++) {
      const artistAlbum = await this.getArtistAlbums(artistIds[i]);
      const date = await artistAlbum.body.items[0].release_date;
      const artistName = await artistAlbum.body.items[0].artists[0].name;
      const artistAlbumName = await artistAlbum.body.items[0].name;
      const releaseDate = new Date(date);
      const currentDate = new Date('2019-10-19');
      await delay(1000);
      if (
        releaseDate >= currentDate &&
        indexOf(artistsNames, artistName) <= -1
      ) {
        this.logger.log(
          `Adding New Artist & New Album:  ${toString(artistAlbum)} `,
        );
        newReleases.push(artistAlbum);
        await this.artistsService.insertArtist(artistName, artistAlbumName);
      } else if (
        releaseDate >= currentDate &&
        find(albumNames, el => el[0] === artistAlbumName) === undefined
      ) {
        this.logger.log(
          `Adding new Album to Database:  ${toString(artistAlbumName)}`,
        );
        newReleases.push(artistAlbum);
        await this.artistsService.updateArtistAlbums(
          artistName,
          artistAlbumName,
        );
      }
    }
    this.logger.log(`There are ${size(newReleases)} new releases`);
    return newReleases;
  }
}
