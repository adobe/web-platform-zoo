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

const { test, expect } = require('@playwright/test');

const allCardsCount = 16;
const categoriesCount = 6;

test('Vanilla templating', async ({ page }) => {
  await page.goto('vanilla/vanilla-templating/');

  // Expect a title to contain a substring
  await expect(page).toHaveTitle(/Vanilla Rendering Adventures/i);

  const assertTitlesPresent = async titles => {
    for(let title of titles) {
      const locator = page.locator(`text=${title}`);
      await expect(locator).toBeVisible();
    }
  }

  const countCards = async () => {
    const cardLocators = await page.$$('div .result-card');
    return cardLocators.length;
  }
  
  expect(await countCards()).toEqual(allCardsCount);
  expect((await (page.$$('#activities li '))).length).toEqual(categoriesCount);
  await assertTitlesPresent([
    "Bali Surf Camp",
    "Overnight Colorado Rock Climbing",
    "Napa Wine Tasting",
  ]);

  const rockButton = page.locator('li:has-text("Rock Climbing")');
  await rockButton.click();
  expect(await countCards()).toEqual(2);
  await assertTitlesPresent([
    "Climbing New Zealand",
    "Overnight Colorado Rock Climbing"
  ])

  await rockButton.click();
  expect(await countCards()).toEqual(allCardsCount);
});
