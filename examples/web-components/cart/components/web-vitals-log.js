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

// Logs Core Web Vitals
class WebVitalsLog extends HTMLElement {
  #observer;
  static elementName = 'web-vitals-log';
  static entryTypes = [
    "largest-contentful-paint",
    "first-input",
    "layout-shift",
    "navigation",
  ];

  constructor() {
    super();
    this.#observer = new PerformanceObserver(this.performanceCallback.bind(this));
    const actualEntryTypes = WebVitalsLog.entryTypes.filter(t => PerformanceObserver.supportedEntryTypes.includes(t));
    console.log(WebVitalsLog.elementName, 'entryTypes', actualEntryTypes);
    this.#observer.observe({ entryTypes: actualEntryTypes });
  }

  performanceCallback(list) {
    list.getEntries().forEach((entry) => {
      console.log(WebVitalsLog.elementName, entry.entryType, entry);
    });
  }

  disconnectedCallback() {
    this.#observer.disconnect();
  }
}
customElements.define(WebVitalsLog.elementName, WebVitalsLog);