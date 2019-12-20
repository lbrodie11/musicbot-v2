import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import puppeteer from 'puppeteer'
import fs from 'fs';
require('newrelic')

const { BASE_URL, FACEBOOK_USERNAME, FACEBOOK_PASSWORD } = process.env;

async function getSpotifyToken() {

  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
];

const options = {
    args,
    headless: true,
    ignoreHTTPSErrors: true,
    userDataDir: './tmp'
};
  
  const browser = await puppeteer.launch(options);
  const preloadFile = fs.readFileSync('./config/preload.js', 'utf8');
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(preloadFile);
  await page.goto(BASE_URL, {waitUntil: 'networkidle2'})
  await page.waitFor(6000);
  await page.click('div a.btn')
  await page.waitFor('input[name=email]');
  await page.waitFor(10000);
  await page.type('input[name=email]', FACEBOOK_USERNAME)
  await page.waitFor(10000);
  await page.type('input[name=pass]', FACEBOOK_PASSWORD)
  await page.waitFor(8000);
  await page.click('button[name=login]')

  Logger.log('Logged in to Facebook from Puppeteer');
  await browser.close()
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  Logger.log(`Server listening on port ${process.env.PORT}`);
  await getSpotifyToken();
}
bootstrap();
