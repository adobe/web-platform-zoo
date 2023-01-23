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

test.use({ javaScriptEnabled: false });

test('Expanding UK list without JavaScript, not enhanced', async ({ page }) => {
  await page.goto('web-components/expanding-list/');

  // Expect a title to contain a substring
  await expect(page).toHaveTitle(/web components example/i);

  // Get locators to test
  const locatorKeys = [ 'uk', 'yorkshire', 'leeds', 'train station' ];
  const locators = {};
  for(let key of locatorKeys) {
    locators[key] = page.locator(`text=${key}`);
  }

  // Assert multiple visibilities in one call
  const assertVisibilty = async (info, ...expected) => {
    for(let i in locatorKeys) {
      const locator = locators[locatorKeys[i]];
      if(expected[i]) {
        await expect(locator, `${info}: expecting ${locator} to be visible`).toBeVisible();
      } else {
        await expect(locator, `${info}: expecting ${locator} to be hidden`).not.toBeVisible();
      }
    }
  }

  await assertVisibilty("Initial visibility", true, true, true, true);

  await locators.uk.click();
  await assertVisibilty("After clicking UK", true, true, true, true);

  await locators.yorkshire.click();
  await assertVisibilty("After clicking Yorkshire", true, true, true, true);

  await locators.leeds.click();
  await assertVisibilty("After clicking Leeds", true, true, true, true);

  await locators.uk.click();
  await assertVisibilty("After clicking UK again", true, true, true, true);
});
