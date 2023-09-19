/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import puppeteer from 'puppeteer';

const args = puppeteer.defaultArgs();

const options = {
  args,
  'headless': 'new',
  'devtools': true
}

const browser = await puppeteer.launch(options);

export async function render(html, scripts) {
  const page = await browser.newPage();
  if (scripts) {
    scripts.forEach(s => {
      html = html.replace('<head>', `<head>\n<script data-ssr-tmp='true'>${s}</script>\n`);
    });
  }
  page.on('console', msg => console.log(`*** puppeteer: ${msg.text()}`));
  await page.setContent(html, {
    waitUntil: ["domcontentloaded"],
  });

  // Cleanup temporary scripts
  await page.evaluate(() => {
    const elements = document.querySelectorAll('script[data-ssr-tmp=true]');
    elements.forEach(e => e.remove());
  });

  // Get HTML including shadow roots
  const output = await page.$eval('html', (element) => {
    return element.getInnerHTML({ includeShadowRoots: true });
  });
  return `<!DOCTYPE html><html>${output}</html>`;
}