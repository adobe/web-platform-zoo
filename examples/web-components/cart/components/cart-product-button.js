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

class CartProductButton extends HTMLElement {
   static style = html`
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
  `;

  constructor() {
    super();
    this.count = 0;
    this.attachShadow({mode:'open'});
  }

  connectedCallback() {
    render(CartProductButton.style, this.shadowRoot);
    const div = document.createElement('div');
    render(html`
      <button id='inc'>+</button>
      <input type='text' size='4' value='${this.count}'></input>
      <button id='dec'>-</button>
      <button id='clear'>=0</button>`, 
      div);
    this.shadowRoot.append(div);
    this.productID = this.getAttribute('product');
    this.shadowRoot.querySelectorAll('button').forEach(b => b.addEventListener('click', this._setCount.bind(this, b.id)));
    this.input = this.shadowRoot.querySelector('input');
    this.input.addEventListener('keyup', this._setCount.bind(this, 'value'));
  }

  _setCount(source) {
      const oldCount = this.count;
      if(source === 'inc') {
        this.count++;
      } else if(source === 'dec') {
        this.count--;
      } else if(source === 'clear') {
        this.count = 0;
      } else {
        const v = Number(this.input.value);
        if(!isNaN(v)) {
          this.count = v;
        }
      }
      this.count = Math.floor(Math.max(0, this.count));
      if(this.count != oldCount) {
        const detail = { productID:this.productID, count:this.count};
        window.dispatchEvent(new CustomEvent('cart:setCount', { detail }));
      }
      this.input.value = this.count;
  }
}

customElements.define('cart-product-button', CartProductButton);