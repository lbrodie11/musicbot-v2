import { Injectable } from '@nestjs/common';
import { use } from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { UserService } from './user.service';
import '../../config/env';

@Injectable()
export class FaceBookStrategy {
  constructor(private readonly userService: UserService) {
    this.init();
  }
  init() {
    use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: '/auth/facebook/callback',
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: any,
        ) => {
          try {
            const user = await this.userService.findOrCreate(profile);
            return done(null, user);
          } catch (err) {
            done(err);
          }
        },
      ),
    );
  }
}
