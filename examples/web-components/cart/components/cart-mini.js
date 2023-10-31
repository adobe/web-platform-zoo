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

import { html, render } from '../scripts/preact-standalone.js';
import '../scripts/cart-logic.js';

class CartMini extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
  }

  connectedCallback() {
    render(html`
      <div>
        <b><span id="nProducts">0</span></b> products
        in cart,
        total <b><span id="nItems">0</span></b> items,
        total price <b>USD <span id="totalPrice">0</span></b>
      </div>`, this.shadowRoot);
    this.nProducts = this.shadowRoot.querySelector("#nProducts");
    this.nItems = this.shadowRoot.querySelector("#nItems");
    this.totalPrice = this.shadowRoot.querySelector("#totalPrice");
    window.addEventListener('cart:changed', this._cartChanged.bind(this));
    this._cartChanged();
  }

  _cartChanged() {
    const cart = window.cart.list('cart').cart;
    this.nProducts.textContent = cart.nProducts;
    this.nItems.textContent = cart.nItems;
    this.totalPrice.textContent = cart.totalPrice;
    this.lastChange = Date.now();
  }
}

customElements.define('cart-mini', CartMini);