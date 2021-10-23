import { Injectable, Logger } from '@nestjs/common';
import * as oauth from 'oauth';
import qp from 'query-params';

const client = new oauth.OAuth(
  `${process.env.TWITTER_URL}/oauth/request_token`,
  `${process.env.TWITTER_URL}/oauth/access_token`,
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1',
);

@Injectable()
export class TwitterApiService {
  private readonly logger = new Logger(TwitterApiService.name);

  async getPlaceId(query: any) {
    const places = await this.get('/geo/search', { query });
    return places.result.places[0].id;
  }

  async getTweets(userId): Promise<any> {
    this.get('/statuses/user_timeline', { user_id: userId });
  }

  async tweet(status) {
    this.post('/statuses/update', { status });
  }

  async tweetWithMedia(status, mediaId) {
    this.post('/statuses/update', { status, media_ids: mediaId });
  }

  async deleteTweet(id) {
    this.post(`/statuses/destroy/${id}`);
  }

  async uploadMedia(dataBuffer) {
    this.upload(`/media/upload`, { media_data: dataBuffer.toString('base64') });
  }

  async get(url, params): Promise<any> {
    this.request(
      'get',
      `${process.env.TWITTER_URL}${process.env.TWITTER_VERSION}${url}.json?${qp.encode(params)}`,
    );
  }

  async post(url, body?) {
    this.request('post', `${process.env.TWITTER_URL}${process.env.TWITTER_VERSION}${url}.json`, body);
  }

  async upload(url, body) {
    this.request(
      'post',
      `${process.env.TWITTER_URL}${process.env.TWITTER_VERSION}${url}.json`,
      body,
      true,
    );
  }

  async request(type, url, body?, isUpload?) {
    this.logger.debug(url, isUpload ? '' : body);
    return new Promise((resolve, reject) => {
      const callback = (err, res) => {
        if (err) {
          this.logger.error(
            err.statusCode ? err.statusCode : err,
            err.data ? err.data : '',
          );
          return reject(err);
        } else {
          this.logger.debug(
            `${type.toUpperCase()} OK - ${res.slice(0, 60)} ...`,
          );
          return resolve(JSON.parse(res));
        }
      };
      const args = [url, process.env.TWITTER_TOKEN, process.env.TWITTER_TOKEN_SECRET];
      if (type === 'post') {
        args.push(body, 'application/x-www-form-urlencoded');
      }
      if (isUpload) {
        args[0] = url.replace('api', 'upload');
      }
      args.push(callback);
      client[type](...args);
    });
  }
}
