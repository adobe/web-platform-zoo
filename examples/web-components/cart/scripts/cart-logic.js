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

class CartLogic {
  static emptyCart = { totalPrice: 0, nProducts:0, nItems: 0 };

  constructor(products) {
    this._products = { products };
    this._cart = { products: {}, cart: CartLogic.emptyCart };
  }

  list(query) {
    if(query === 'cart') {
      return this._cart;
    } else {
      return this._products;
    }
  }

  get(id) {
    return this._products.products[id];
  }

  _setCount(e) {
    // Update cart
    const product = this._products.products[e.productID];
    if(e.count == 0) {
      delete this._cart.products[e.productID];
    } else {
      this._cart.products[e.productID] = {
        count: e.count,
        price: product.price
      }
    }

    // Set cart values
    const cart = this._cart.cart;
    cart.nItems = 0;
    cart.totalPrice = 0;
    const products = this._cart.products;
    Object.keys(products).forEach(k => {
      const price = products[k].count * products[k].price;
      cart.totalPrice += price;
      cart.nItems += products[k].count;
    });
    cart.nProducts = Object.keys(products).length;

    // And let others know
    window.dispatchEvent(new CustomEvent('cart:changed'));
  }
}

if (!window.cart) {
  const getJson = async (filename) => {
    const url = `${import.meta.url}${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error retrieving ${url}`);
    }
    return JSON.parse(await response.text());
  }

  const getProducts = async () => {
    const products = await getJson('/../../data/products.json');
    const descriptions = await getJson('/../../data/descriptions.json');

    for (let k of Object.keys(products)) {
      const product = products[k];
      product.id = k;
      const desc = descriptions[product.image];
      if(desc) {
        product.name = desc.name;
        product.description = desc.description;
      }
    }
    return products;
  }
  window.cart = new CartLogic(await getProducts());
  window.addEventListener('cart:setCount', e => window.cart._setCount(e.detail));
}