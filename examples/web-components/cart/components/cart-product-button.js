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

class CartProductButton extends HTMLElement {
  static template = document.createElement('template');
  static {
   CartProductButton.template.innerHTML =  `
    <style type='text/css'>
    button {
      background-color: var(--cart-product-button-bg, orange);
      color: var(--cart-product-button-fg, black);
      border-radius: var(--cart-product-button-corner-radius, 5px);
      font-size: var(--cart-product-button-font-size, 100%);
    }
    input {
      font-size: var(--cart-product-button-font-size, 100%);
    }
    </style>
    <div role='slider' aria-label='in cart'>
      <button aria-hidden='true' tabindex='-1' id='1'>+</button>
      <input
        aria-hidden='true'
        type='text'
        size='4'
      ></input>
      <button aria-hidden='true' tabindex='-1' id='-1'>-</button>
    </div>
  `;
  }

  constructor() {
    super();
    this.count = 0;
    this.attachShadow({mode:'open'});
  }

  connectedCallback() {
    this.shadowRoot.append(CartProductButton.template.content.cloneNode(true));

    const pidAttr = this.getAttribute('productID');
    this.product = window.cart.get(pidAttr);
    if(!this.product) {
      throw new Error(`Product not found: ${pidAttr}</div>`);
    }
    this.shadowRoot.querySelectorAll('button').forEach(b => b.addEventListener('click', this._setCount.bind(this, b.id)));
    this.slider = this.shadowRoot.querySelector('div[role=slider]');
    this.input = this.shadowRoot.querySelector('input');
    this.inCart = window.cart.list('cart').products[this.product.id];
    if(this.inCart) {
      this.count = this.inCart.count;
    }
    this.input.value = this.count;
    this.input.addEventListener('keyup', this._keypressed.bind(this));
    this.input.addEventListener('focus', this._focused.bind(this));
  }

  _focused() {
    window.dispatchEvent(new CustomEvent('cart:status', { detail: `${this.product.name} selected` }));
  }

  _keypressed(e) {
    var source = 'value';
    if(e.key == 'ArrowUp') {
      source = '1';
    } else if(e.key == 'PageUp') {
      source = 10;
    } else if(e.key == 'ArrowDown') {
      source = '-1';
    } else if(e.key == 'PageDown') {
      source = -10;
    }
    this._setCount(source);
  }

  _setCount(source) {
      const oldCount = this.count;
      if(!isNaN(source)) {
        this.count += Number(source);
      } else {
        const v = Number(this.input.value);
        if(!isNaN(v)) {
          this.count = v;
        }
      }
      this.count = Math.floor(Math.max(0, this.count));
      if(this.count != oldCount) {
        const detail = { productID:this.product.id, count:this.count};
        window.dispatchEvent(new CustomEvent('cart:setCount', { detail }));
      }
      this.input.value = this.count;

      this.slider.setAttribute('aria-valuenow', `${this.count}`);
  }
}

customElements.define('cart-product-button', CartProductButton);