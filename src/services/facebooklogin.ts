import puppeteer from 'puppeteer';

import '../config/env';

const { BASE_URL, FACEBOOK_USERNAME, FACEBOOK_PASSWORD } = process.env;

export async function getSpotifyToken() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(5000);
  await page.click('div a.btn');
  await page.waitFor('input[name=email]');
  await page.waitForTimeout(5000);
  await page.type('input[name=email]', FACEBOOK_USERNAME);
  await page.waitForTimeout(5000);
  await page.type('input[name=pass]', FACEBOOK_PASSWORD);
  await page.waitForTimeout(3000);
  await page.click('button[name=login]');

  await browser.close();
}

getSpotifyToken();
