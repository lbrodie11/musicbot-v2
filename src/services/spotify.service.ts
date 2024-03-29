import { Injectable, Logger } from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import moment from 'moment';
import SpotifyWebApi from 'spotify-web-api-node';
import { find, size, toString, indexOf } from 'lodash';

interface Response<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

@Injectable()
export class SpotifyService {
  private spotifyApi: SpotifyWebApi;
  private readonly logger = new Logger(SpotifyService.name);
  constructor(private readonly artistsService: ArtistService) {
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
    return new Promise<void>(r => r());
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
    albumIds: any,
    dBArtistIds: any
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
      const albumId = await artistAlbum.body.items[0].id
      const artistName = await artistAlbum.body.items[0].artists[0].name;
      const albumName = await artistAlbum.body.items[0].name;
      const releaseDate = new Date(date);
      const currentDate = new Date('2019-10-19');
      await delay(1000);
      if (
        releaseDate >= currentDate &&
        indexOf(dBArtistIds, artistIds[i]) === -1
        // indexOf(artistsNames, artistName) <= -1
      ) {
        this.logger.log(
          `Adding New Artist & New Album:  ${toString(artistAlbum)} `,
        );
        const artistId = artistIds[i]
        const input = {
          artistId,
          albumId, 
          albumName,
          artistName
        }
        await this.artistsService.createArtist(input);
        newReleases.push(artistAlbum);
      } else if (
        releaseDate >= currentDate &&
        // find(albumNames, el => el[0] === artistAlbumName) === undefined
        // find(albumIds, el => el[0] === albumId) === undefined
        indexOf(albumIds, albumId) === -1
      ) {
        this.logger.log(
          `Adding new Album to Database: ${toString(albumName)} by ${toString(artistName)}`,
        );
        // await this.artistsService.updateArtistAlbum(
        //   artistName,
        //   artistAlbumName,
        //   albumIds[1]
        // );
        newReleases.push(artistAlbum);
      }
    }
    this.logger.log(`There are ${size(newReleases)} new releases`);
    return newReleases;
  }
}
