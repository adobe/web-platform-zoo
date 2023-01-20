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

const initialItemsCount = 3;

class Wrapper {
  input;
  itemsCount;
  filtersAndStatus;
  markAllComplete;
  clearCompleted;

  constructor(page) {
    this.input = page.getByPlaceholder('What needs to be done?');
    this.itemsCount = page.locator('//*[@data-todo="count"]');
    this.filtersAndStatus = page.locator('//footer[@class="footer"]');
    this.markAllComplete = page.getByText('Mark all as complete');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
  }

  async assertCountDisplay(count) {
    const expected = `${count} items left`;
    await expect(this.itemsCount).toContainText(expected)
  }

  async addItem(text) {
    await this.input.click();
    await this.input.fill(text);
    await this.input.press('Enter');
  }
}

test.describe('TodoMVC using Web Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('web-components/todomvc/');
    await expect(page).toHaveTitle(/TodoMVC using Web Components/i);
    const w = new Wrapper(page);
    await w.assertCountDisplay(initialItemsCount);
    await expect(w.filtersAndStatus).toBeVisible();
  });

  test("Add & count items", async ({ page }) => {
    const w = new Wrapper(page);
    await w.addItem("First One");
    await w.assertCountDisplay(initialItemsCount + 1);
    await w.addItem("Second Two");
    await w.assertCountDisplay(initialItemsCount + 2);
    await expect(w.filtersAndStatus).toBeVisible();
  });

  test("Toggle & delete all items", async ({ page }) => {
    const w = new Wrapper(page);
    await expect(w.filtersAndStatus).toBeVisible();
    await w.markAllComplete.click();
    await expect(w.filtersAndStatus).toBeVisible();
    await w.assertCountDisplay(initialItemsCount);
    await w.clearCompleted.click();
    await expect(w.filtersAndStatus).not.toBeVisible();
  });

  test("Edit an item", async ({ page }) => {
    const w = new Wrapper(page);
    /* TODO
    await page
      .getByRole('label')
      .filter({ hasText: /Rewrite the rules/})
      .dblclick();
    */
  });

  test("Item filters", async ({ page }) => {
    const w = new Wrapper(page);
    // TODO
  });
});
