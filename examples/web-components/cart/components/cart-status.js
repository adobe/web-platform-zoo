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

class CartStatus extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'status');
    this.setAttribute('style', 'opacity:0');
    this.lastChange = Date.now();
    this.status = '';

    window.addEventListener('cart:changed', this._cartChanged.bind(this));
    window.addEventListener('cart:setStatus', this._setStatus.bind(this));

    this._everySecond();
  }

  _cartChanged() {
    this.lastChange = Date.now();
  }

  _setStatus() {
    this.textContent = this.status;
    this.lastChange = Date.now();
  }

  _everySecond() {
    const cart = window.cart.list('cart').cart;
    const newStatus = `${cart.nProducts} products in cart, total ${cart.nItems} items, ${cart.totalPrice} dollars`;
    const delta = Date.now() - this.lastChange;
    const minWaitBeforeStatus = 2000;
    if(delta >= minWaitBeforeStatus && newStatus != this.statusText) {
      this.status = newStatus;
      window.dispatchEvent(new CustomEvent('cart:setStatus'));
    }
    setTimeout(() => requestIdleCallback(this._everySecond.bind(this)), 1000);
  }
}

customElements.define('cart-status', CartStatus);