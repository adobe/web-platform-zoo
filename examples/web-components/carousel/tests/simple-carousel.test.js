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

const images = [
  { 
    caption: "Extreme skiing",
    srcRegexp: /adobestock-185234795.jpg/
  },
  { 
    caption: "Climbing at sunset",
    srcRegexp: /adobestock-241578158.jpg/
  },
  { 
    caption: "Atlantic coast",
    srcRegexp: /adobestock-151584995.jpg/
  },
  { 
    caption: "At the ski resort",
    srcRegexp: /adobestock-184591344.jpg/
  },
  { 
    caption: "Cycling in the red mountains",
    srcRegexp: /adobestock-185324648.jpg/
  },
  { 
    caption: "Surfing fun",
    srcRegexp: /adobestock-175749320.jpg/
  },
];

test('Simple carousel Web Component', async ({ page }) => {
  await page.goto('web-components/carousel/');

  await expect(page).toHaveTitle(/Carousel Web Components Example/i);

  const carousel = page.locator('//simple-carousel');

  const assertImage = async (index, info) => {
    await expect(carousel, info).toHaveAttribute('data-current-caption', images[index].caption);
    await expect(carousel, info).toHaveAttribute('data-current-src', images[index].srcRegexp);
  }

  const navigate = async (next=true) => {
    const event = next ? 'carousel-next' : 'carousel-previous';
    await page.dispatchEvent('//simple-carousel', event);
  }

  for(let i in images) {
    await assertImage(i, `at step ${i}`);
    await navigate();
  }
  await assertImage(0, 'back to start after one more click');
  await navigate();
  await navigate();
  await assertImage(2, 'after 2 more forward clicks');
  await navigate(false);
  await assertImage(1, 'after 1 backward click');
  await navigate(false);
  await assertImage(0, 'after 2 backward clicks');
  await navigate(false);
  await assertImage(5, 'after 3 backward clicks');
  await navigate(false);
  await assertImage(4, 'after 4 backward clicks');
});
