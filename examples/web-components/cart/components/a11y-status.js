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

import '../scripts/cart-logic.js';

// Status element meant for a11y, with a "status" role,
// changes its content when a11y:status events are received
//
class A11yStatus extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'status');

    // TODO how to make this invisible but relevant for a11y ?
    this.setAttribute('style', 'opacity:0;');

    window.addEventListener('a11y:status', this._setStatus.bind(this));
  }

  _setStatus(e) {
    const status = e.detail?.status;
    if (status && status != this.textContent) {
      this.textContent = status;
    }
  }
}


customElements.define('a11y-status', A11yStatus);