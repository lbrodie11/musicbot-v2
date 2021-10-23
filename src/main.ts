import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import puppeteer from 'puppeteer-extra';
import * as fs from 'fs';
import { resolve } from 'path';
// import cookies from './cookies.json';
// require('newrelic');
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';



const { BASE_URL, FACEBOOK_USERNAME, FACEBOOK_PASSWORD, PORT, DB_URL, DB_USER, DB_PASSWORD } = process.env;

async function getSpotifyToken() {
  Logger.log('Trying to login to Spotify from Puppeteer');
  puppeteer.use(require('puppeteer-extra-plugin-stealth')())

  const browser = await puppeteer.launch({
    userDataDir: resolve('user_data'),
    headless: true,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
    ],
  });
  const page = await browser.newPage();
  Logger.log('Opened new page in Puppeteer');
  
  // if (Object.keys(cookies).length) {
  //   Logger.log('Setting cookies');
  //   Logger.log(cookies)
  //   const cookiesString = await fs.readFile('./cookies.json', );
  //   const cookies = JSON.parse(cookiesString);
  //   await page.setCookie(...cookies)
  //   await page.setCookie(...cookies);
  //   Logger.log(cookies)
  //   Logger.log(`Going to ${BASE_URL} using Puppeteer Cookies`);
  //   await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  //   await page.goto('https://musiclackey.herokuapp.com', { waitUntil: 'networkidle0' });
  //   Logger.log('Logged in to Facebook from Puppeteer from cookies');
  //   await browser.close();
  // } else {
    Logger.log(`Going to ${BASE_URL} using Puppeteer`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(7000);
    await page.waitFor('//*[@id="__next"]/div[1]/header/div/nav/ul/li[6]/a');
    await page.click('//*[@id="__next"]/div[1]/header/div/nav/ul/li[6]/a');
    await page.type('//*[@id="login-password"]', 'lbrodie11@gmail.com');
    await page.waitForTimeout(10000);
    await page.click('//*[@id="login-password"]');
    await page.waitForTimeout(10000);
    await page.type('//*[@id="login-password"]', 'June198906');
    await page.waitForTimeout(10000);
    await page.click('//*[@id="login-button"]');

    // let currentCookies = await page.cookies();

    // fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies))

    Logger.log('Logged in to Spotify from Puppeteer');
    await browser.close();
  // }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(PORT || 3000);
  Logger.log(`Server listening on port ${PORT}`);
  // await getSpotifyToken();
}
bootstrap();
