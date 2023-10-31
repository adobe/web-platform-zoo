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

class ProductList extends HTMLElement {
  static products = window.cart.list();

  static style = html`
    <style type='text/css'>
    ul {
      list-style-type:none;
      display: flex;
      flex-flow: row wrap;
    }
    </style>
  `;

  constructor() {
    super();
    this.attachShadow({mode:'open'});
  }


  connectedCallback() {
    render(ProductList.style, this.shadowRoot);
    const ul = document.createElement('ul');
    const list = ProductList.products.products;
    for(let k of Object.keys(list)) {
      const p = list[k];
      const li = document.createElement('li');
      ul.appendChild(li);
      render(html`<li><product-card productID="${p.id}"></product-card></li>`, li);
    }
    this.shadowRoot.append(ul);
  }
}

customElements.define('product-list', ProductList);