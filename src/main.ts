import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import puppeteer from 'puppeteer'
const fs = require('fs');
const cookies = require('../cookies.json')
require('newrelic')

const { BASE_URL, FACEBOOK_USERNAME, FACEBOOK_PASSWORD } = process.env;

async function getSpotifyToken() {
  
  const browser = await puppeteer.launch({headless: true, defaultViewport: null, args: ['--no-sandbox', '--disable-setuid-sandbox']})
  const page = await browser.newPage()
  if(Object.keys(cookies).length){
    await page.setCookie(...cookies)

    await page.goto(BASE_URL, {waitUntil: 'networkidle2'})
  } else {
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
  let currentCookies = await page.cookies()

  fs.writeFileSync('../cookies.json', JSON.stringify(currentCookies))
  
  }
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
