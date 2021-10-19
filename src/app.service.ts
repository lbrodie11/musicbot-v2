import { Injectable } from '@nestjs/common';
import { ReleaseService } from './services/release.service';
import { SpotifyService } from './services/spotify.service';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  constructor(
    private readonly releaseService: ReleaseService,
    private readonly spotify: SpotifyService,
  ) {}

  async login(req: Request, res: Response) {
    const stateKey = 'spotify_auth_state';
    const state = this.randomString(16);
    const scopes = ['user-follow-read'];
    res.cookie(stateKey, state);
    const authURL = await this.spotify.createAuthorizeURL(scopes, state);
    return res.redirect(authURL);
  }

  async callback(req: Request, res: Response) {
    const schedule = '*/50 * * * *';
    try {
      const authCodeGrant:any = req?.query?.code
      const retData = await this.spotify.authorizationCodeGrant(authCodeGrant);
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = retData.body;

      this.spotify.setAccessToken(accessToken);
      this.spotify.setRefreshToken(refreshToken);
      this.releaseService.runReleaseWatcher(schedule);

      return res.redirect('/');
    } catch (err) {
      return res.send(err);
    }
  }

  randomString(length: any) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
