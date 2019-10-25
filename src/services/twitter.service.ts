import { Injectable, Logger } from '@nestjs/common';
import { TwitterApiService } from './twitter.api.service';
import '../config/env';

const { TWITTER_USER_ID } = process.env;

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterApiService.name);
  constructor(private readonly twitterapi: TwitterApiService) {}

  async removeAllTweets() {
    try {
      this.logger.log('Remove all tweets');
      const tweets = await this.twitterapi.getTweets(TWITTER_USER_ID);
      await Promise.all(
        tweets.map(tweet => this.twitterapi.deleteTweet(tweet.id_str)),
      );
      this.logger.log(`Removed ${tweets.length} tweets`);
    } catch (err) {
      this.logger.error('Remove all tweets failed', err);
    }
    process.exit(0);
  }

  // async tweetNewArticles() {
  //   const newsArticles = await news.getNews()
  //   console.log(newsArticles)
  //   await newsArticles.forEach((element, index) => {
  //     setTimeout(function () {
  //       let articleInfo = {
  //         articleDesc: element.articles[0].description,
  //         articleUrl: element.articles[0].url,
  //         articleSource: element.articles[0].source.name
  //       }
  //       var currentDate = new Date();
  //       this.logger.info('Preparing tweet for new article for: ' + currentDate);
  //       this.logger.info(articleInfo);
  //       this.logger.info('tweeting')
  //       const status = this.buildNewsTweetStatus(articleInfo);
  //       this.logger.info('Posting tweet for a new article');
  //       this.logger.info(status);
  //       this.twitter.tweet(status);
  //     }, index * 10000)
  //   })
  //   var currentDate = await new Date();
  //   this.logger.info('Preparing tweet for latest articles for: ' + currentDate);
  // const status = await buildNewsTweetStatus(articleInfo);
  // logger.info('Posting tweet for a new article');
  // logger.info(status);
  // await twitter.tweet(status);
  // };

  async tweetNewAlbumReleases(albumInfo) {
    const currentDate = await new Date();
    this.logger.log(
      'Preparing tweet for latest album releases for: ' + currentDate,
    );
    const status = await this.buildTweetStatus(albumInfo);
    this.logger.log('Posting tweet for a new release');
    this.logger.log(status);
    await this.twitterapi.tweet(status);
  }

  async buildTweetStatus(albumInfo) {
    const {
      releaseDate,
      artistName,
      albumName,
      spotifyUrl,
      albumType,
    } = albumInfo;
    this.logger.log(`Album Type: ${albumType}`);
    if (albumType === 'album') {
      return `
        🎵 New Album Release 🔥 
    
        📅 ${releaseDate}
        🎙️ Artist: ${artistName}
        💿 Album: ${albumName}
    
        🏷️ #music #spotify #album #musiclackey #${artistName.replace(/ /g, '')}
    
        🔗 ${spotifyUrl}
        `;
    } else {
      return `
        🎵 New Single Release 🔥 
        
        📅 ${releaseDate}
        🎙️ Artist: ${artistName}
        💿 Single: ${albumName}
    
        🏷️ #music #spotify #single #musiclackey #${artistName.replace(/ /g, '')}
    
        🔗 ${spotifyUrl}
        `;
    }
  }

  async buildNewsTweetStatus(albumInfo) {
    const { articleSource, articleUrl, articleDesc } = albumInfo;
    this.logger.log(`Article Source: ${articleSource}`);

    return `
        ${articleDesc}
        ${articleUrl}
        `;
  }
}
