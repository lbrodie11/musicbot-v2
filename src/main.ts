import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';
import * as cookies from './cookies.json';
import * as fs from 'fs';
require('newrelic');

const { BASE_URL, FACEBOOK_USERNAME, FACEBOOK_PASSWORD, PORT } = process.env;

async function getSpotifyToken() {
  Logger.log('Trying to login to Facebook from Puppeteer');
  puppeteer.use(pluginStealth());

  const browser = await puppeteer.launch({
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
  
  if (Object.keys(cookies).length) {
    Logger.log('Setting cookies');
    Logger.log(cookies)
    // @ts-ignore
    await page.setCookie(...cookies);
    Logger.log(`Going to ${BASE_URL} using Puppeteer Cookies`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.goto('https://musiclackey.herokuapp.com', { waitUntil: 'networkidle0' });
    Logger.log('Logged in to Facebook from Puppeteer from cookies');
    await browser.close();
  } else {
    Logger.log(`Going to ${BASE_URL} using Puppeteer`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.waitFor(7000);
    await page.click('div a.btn');
    await page.waitFor('input[name=email]');
    await page.waitFor(10000);
    await page.type('input[name=email]', FACEBOOK_USERNAME);
    await page.waitFor(10000);
    await page.type('input[name=pass]', FACEBOOK_PASSWORD);
    await page.waitFor(10000);
    await page.click('button[name=login]');

    let currentCookies = await page.cookies();

    fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies))

    Logger.log('Logged in to Facebook from Puppeteer');
    await browser.close();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(PORT || 3000);
  Logger.log(`Server listening on port ${PORT}`);
  await getSpotifyToken();
}
bootstrap();
