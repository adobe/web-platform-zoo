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

test('Mutually exclusive accordion items', async ({ page }) => {
  await page.goto('web-components/accordion/');

  await expect(page).toHaveTitle(/Accordion Web Components Example/i);

  const texts = [
    page.locator('text=description of item one'),
    page.locator('text=description of item two'),
    page.locator('text= suite of different technologies'),
  ];
  await expect

  // Assert multiple visibilities in one call
  const assertVisibilty = async (info, ...expected) => {
    for(let i in texts) {
      const text = texts[i];
      if(expected[i]) {
        await expect(text, `${info}: expecting ${text} to be visible`).toBeVisible();
      } else {
        await expect(text, `${info}: expecting ${text} to be hidden`).not.toBeVisible();
      }
    }
  }

  const first = page.locator('text=the first item');
  const second = page.locator('text=the second item');
  const third = page.locator('text=the third, longer item');

  await assertVisibilty("Initial visibility", false, true, false);
  await first.click();
  await assertVisibilty("After clicking first", true, false, false);
  await second.click();
  await assertVisibilty("After clicking second", false, true, false);
  await third.click();
  await assertVisibilty("After clicking third", false, false, true);
});
