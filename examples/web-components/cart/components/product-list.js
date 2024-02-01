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

// Display the list of products. The 'query' attribute
// can be set to 'cart' to show only the products
// currently in the cart.
class ProductList extends HTMLElement {
  static template = document.createElement('template');
  static {
    // TODO we might optionally get the template from
    // the current document, driven by an attribute
    // on this component. Didn't need that so far.
    ProductList.template.innerHTML = `
      <article itemscope class="product">
        <img itemprop="image">
        <h2 itemprop="name"></h2>
        <inc-dec-input itemprop="cart.product.total.count" data-set-attr="value" event="cart:setCount">
          <button tabindex='-1'>+</button>
          <input size="4"></input>
          <button tabindex='-1' tabindex='-1'>-</button>
        </inc-dec-input>
        <p class="price">USD&ThinSpace;<span itemprop="price"></span>:<b><span itemprop="cart.product.total.count"></span></b>&ThinSpace;in cart&ThinSpace;&rightarrow;&ThinSpace;USD&ThinSpace;<b><span itemprop="cart.product.total.price"></span></b></p>
        <p itemprop="description" class="description"></p>
      </article>
    `;
  }

  connectedCallback() {
    // get and render products
    const products = window.cart.list(this.getAttribute('query'))?.products;
    for (let k of Object.keys(products)) {
      const product = products[k];
      const article = ProductList.template.content.cloneNode(true);
      article.querySelector('article[itemscope]')?.setAttribute('itemid', product.id);
      article.querySelectorAll('*[itemprop]').forEach(e => this._setStaticValues(e, product));
      this.append(article);
    }

    // watch for changes
    window.addEventListener('cart:changed', this._setCartValues.bind(this));
    this._setCartValues();
  }

  // set values from the current cart state
  _setCartValues() {
    this.querySelectorAll('article').forEach(article => {
      const product = window.cart.list()?.products[article.getAttribute('itemid')];
      const inCart = window.cart.list('cart')?.products[product?.id];
      const incdec = article.querySelector('inc-dec-input');
      if(incdec) {
        incdec.setAttribute('value', inCart ? inCart.count : 0);
        incdec.setAttribute('aria-label', product.name);
      }
      if(!product) {
        console.log('setCartValues', `product not found: ${product?.id})`);
        return;
      }
      article.querySelectorAll('*[itemprop]').forEach(e => {
        const prop = e.getAttribute('itemprop');
        if (prop === 'cart.product.total.price') {
          e.textContent = inCart ? inCart.count * product.price : 0;
        } else if (prop === 'cart.product.total.count') {
          const setAttribute = e.getAttribute('data-set-attr');
          const value = inCart ? inCart.count : 0;
          if (setAttribute) {
            e.setAttribute(setAttribute, value);
          } else {
            e.textContent = value;
          }
        }
      });
    });
  }

  // set values which do not depend on the cart state
  _setStaticValues(e, product) {
    const prop = e.getAttribute('itemprop');
    if (prop === 'image') {
      e.setAttribute('src', `./images/${product.image}`);
      e.setAttribute('alt', `${product.name}`);
    } else if (product[prop]) {
      e.textContent = product[prop];
    }
  }
}

customElements.define('product-list', ProductList);