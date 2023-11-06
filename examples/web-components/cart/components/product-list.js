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

class ProductList extends HTMLElement {
  static template = document.createElement('template');
  static {
    ProductList.template.innerHTML = `
      <article itemscope class="product">
        <img itemprop="image">
        <h2 itemprop="name"></h2>
        <p class="price">USD <span itemprop="price"></span>, <span itemprop="cart.product.total.count"></span> in cart, total USD <span itemprop="cart.product.total.price"></span></p>
        <inc-dec-input event="cart:setCount"><button>+</button><input size="4"></input><button>-</button></inc-dec-input>
        <p itemprop="description" class="description"></p>
      </article>
    `;
  }

  connectedCallback() {
    const products = window.cart.list(this.getAttribute('query'))?.products;
    for(let k of Object.keys(products)) {
      const product = products[k];
      const article = ProductList.template.content.cloneNode(true);
      article.querySelector('*[itemscope]')?.setAttribute('itemid', product.id);
      const inCart = window.cart.list('cart')?.products[product.id];
      article.querySelectorAll('*[itemprop]').forEach(e => this._setValues(e, product, inCart));
      this.append(article);
    }
  }

  _setValues(e, product, inCart) {
    const prop = e.getAttribute('itemprop');
    if(prop === 'image') {
      e.setAttribute('src', `./images/${product.image}`);
    } else if(prop === 'cart.product.total.price') {
      // TODO dynamic update
      e.textContent = inCart ? inCart.count * product.price : 0;
    } else if(prop === 'cart.product.total.count') {
      // TODO dynamic update
      e.textContent = inCart ? inCart.count : 0;
    } else if(product[prop]) {
      e.textContent = product[prop];
    } else {
      console.log(`ProductList property ${prop} not found`);
    }
  }
}

customElements.define('product-list', ProductList);