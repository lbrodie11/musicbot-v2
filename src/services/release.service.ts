import { Injectable, Logger } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { ArtistsService } from './artists.service';
import { SpotifyService } from './spotify.service';
import schedule from 'node-schedule';
// const newsDb = require('../persistence/newsDb')
// const news = require('../api/news')
// const author = require('../persistence/author')

let counterExec = 0;
let counterRelease = 0;

@Injectable()
export class ReleaseService {
  private readonly logger = new Logger(ReleaseService.name);
  constructor(
    private readonly spotify: SpotifyService,
    private readonly artist: ArtistsService,
    private readonly twitter: TwitterService,
  ) {}

  async runReleaseWatcher(
    cronSchedule:
      | string
      | number
      | schedule.RecurrenceRule
      | schedule.RecurrenceSpecDateRange
      | schedule.RecurrenceSpecObjLit
      | Date,
  ) {
    this.logger.log(`Setup scheduler with schedule ${cronSchedule}`);
    schedule.scheduleJob(cronSchedule, async () => {
      try {
        this.logger.log(`Connection Established`);
        this.logger.log(`Execution #${++counterExec} starts`);
        await this.spotify.refreshToken();
        this.logger.log('Get Followed Artists data initialized');
        const artists = await this.spotify.getFollowedArtists();
        this.logger.log(`Currently following ${artists.length} artists`);
        const artistIds = await artists.map(a => a.id);
        this.logger.log('Get Artist albums initialized');
        const artistsNames = await this.artist.getArtistNames();
        const albumNames = await this.artist.getAlbumNames();
        const newReleases = await this.spotify.getNewReleases(
          artistIds,
          artistsNames,
          albumNames,
        );
        const that = this;
        newReleases.forEach((element, index) => {
          setTimeout(() => {
            counterRelease++;
            const albumInfo = {
              albumArt: element.body.items[0].images[1].url,
              albumName: element.body.items[0].name,
              releaseDate: element.body.items[0].release_date,
              artistName: element.body.items[0].artists[0].name,
              spotifyUrl:
                element.body.items[0].artists[0].external_urls.spotify,
              albumType: element.body.items[0].album_type,
            };
            const currentDate = new Date();
            that.logger.log(
              'Preparing tweet for new album releases for: ' + currentDate,
            );
            this.logger.log(albumInfo);
            this.logger.log('tweeting');
            this.twitter.tweetNewAlbumReleases(albumInfo);
          }, index * 10000);
        });
        this.logger.log(`Albums Releases since deployment: ${counterRelease}`);
        this.logger.log(`Execution end for Album Releases\n`);
      } catch (err) {
        if (err.statusCode === 401) {
          this.logger.error(err);
          this.logger.error(`Access token expired\n`);
        } else {
          this.logger.error(err);
        }
      }
      // try {
      //     await newsDb.initDb()
      //     logger.log('Get Author Articles initialized');
      //     const authorNames = await author.findAuthorNames()
      //     const authorArticleTitles = await author.findArticleTitles()
      //     logger.log(`Authors in Database:  ${authorNames.length()}`)
      //     logger.log(`Articles in Database: ${authorArticleTitles.length()}`)
      //     logger.log('Checking news Articles')
      //     const newsArticles = await news.getNews()
      //     await newsArticles.forEach((element, index, array) => {
      //         setTimeout(function () {
      //             let articleInfo = {
      //                 articleDesc: element.articles[0].description,
      //                 articleUrl: element.articles[0].url,
      //                 articleSource: element.articles[0].source.name
      //             }
      //             let currentDate = new Date();
      //             logger.log('Preparing tweet for new article for: ' + currentDate);
      //             logger.log(articleInfo);
      //             logger.log('tweeting')
      //             twitter.tweetNewArticles(articleInfo)
      //         }, index * 10000)
      //     })

      // } catch (err) {
      //     logger.error(err)
      // }
    });
  }
}
