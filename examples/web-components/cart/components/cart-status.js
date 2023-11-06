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
    window.addEventListener('cart:changed', this._render.bind(this));
    this._render();
  }

  _render() {
    const cart = window.cart.list('cart').cart;
    this.querySelectorAll('*[itemprop]').forEach(e => this._setValue(e, cart));
  }

  _setValue(e, cart) {
    const prop = e.getAttribute('itemprop');
    if(prop === 'total.products') {
      e.textContent = cart.nProducts;
    } else if(prop === 'total.items') {
      e.textContent = cart.nItems;
    } else if(prop === 'total.price') {
      e.textContent = cart.totalPrice;
    }
  }
}

customElements.define('cart-status', CartStatus);