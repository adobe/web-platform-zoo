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

class ProductCard extends HTMLElement {

  static style = html`
    <style type='text/css'>
      article {
        padding: 1em;
        display: flex;
        flex-direction: row;
        line-height: 1em;
      }
      img {
        height: var(--product-card-height, 500px);
      }
      #text {
        flex: 10;
        padding: 1em;
        width: calc(2 * var(--product-card-height, 500px));
      }
      .description {
        max-height: 3em;
        overflow-y: auto;
      }
      </style>
  `;

  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this.productID = this.getAttribute('productID');
    window.addEventListener('cart:changed', this._cartChanged.bind(this));
  }

  connectedCallback() {
    render(ProductCard.style, this.shadowRoot);
    const p = window.cart.get(this.productID);
    if(!p) {
      render(html`<div class='error'>Product not found: ${this.productID}</div>`, this.shadowRoot);
      return;
    }
    const article = document.createElement('article');
    article.setAttribute('aria-label', p.name);
    render(html`
      <img src='images/${p.image}' alt='${p.name}'></img>
      <div id='text'>
        <h3>${p.name}</h3>
        <p id='price'></p>
        <cart-product-button productID='${p.id}'></cart-product-button>
        <cart-product-status productID='${p.id}'></cart-product-status>
        <p tabindex='-1' id='product-description-${p.id}' class='description'><em>${p.description}</em></p>
      </div>`,
      article);
    this.shadowRoot.append(article);
    this.price = this.shadowRoot.querySelector('#price');
    this._cartChanged();
  }

  _cartChanged() {
    const p = window.cart.list().products[this.productID];
    const inCart = window.cart.list('cart').products[this.productID];
    if(p && this.price) {
      const price = inCart ? `, total USD ${p.price * inCart.count}` : '';
      this.price.textContent = `USD ${p.price} per unit${price}`;
    }
  }
}

customElements.define('product-card', ProductCard);