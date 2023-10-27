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
import ProductDB from '../scripts/product-db.js';

class ProductList extends HTMLElement {
  static products = new ProductDB();

  connectedCallback() {
    this._render();
  }

  _render() {
    const ul = document.createElement('ul');
    const list = ProductList.products.products();
    for(let k of Object.keys(list)) {
      const p = list[k];
      const li = document.createElement('li');
      ul.appendChild(li);
      render(html`<li><cart-product-button product='${p.id}'></cart-product-button> :: <b>${p.name}</b> - <em>${p.description}</em></li>`, li);
    }
    this.replaceChildren(ul);
  }
}

customElements.define('product-list', ProductList);