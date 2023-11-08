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

// Simulate a shopping cart service.
//
// State is stored in local storage and
// Custom Events drive cart contents changes.
//
// This module sets window.cart to a CartLogic singleton.
class CartLogic {

  constructor(storageKey, products) {
    this._storageKey = storageKey;
    this._products = { products };
    this._cart = this._loadCart();
  }

  list(query) {
    return query === 'cart' ? this._cart : this._products;
  }

  get(id) {
    return this._products.products[id];
  }

  // initial loading of cart data
  _loadCart() {
    var result = { products: {}, cart: { totalPrice: 0, nProducts:0, nItems: 0 }};
    const json = window.localStorage.getItem(this._storageKey);
    if(json) {
      try {
        result = JSON.parse(json);
      } catch(e) {
        console.log(`CartLogic: error parsing stored cart, using empty cart: ${json}`);
      }
    }
    return result;
  }

  // Set the current count of specified and emit
  // a change event if relevant. Triggered by
  // a cart:setCount CustomEvent.
  _setCount(cmd) {
    cmd.count = Number(cmd.count);

    // Update cart
    const product = this._products.products[cmd.productID];
    if(cmd.count == 0) {
      delete this._cart.products[cmd.productID];
    } else {
      this._cart.products[cmd.productID] = {
        count: cmd.count,
        ...product
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

    // Store cart data
    window.localStorage.setItem(this._storageKey, JSON.stringify(this._cart));

    // And let others know
    window.dispatchEvent(new CustomEvent('cart:changed'));
  }
}

// Set window.cart if needed, with simulated product data
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
  const localStorageKey = 'wpzoo-example-shopping-cart-2';
  window.cart = new CartLogic(localStorageKey, await getProducts());
  window.addEventListener('cart:setCount', e => window.cart._setCount(e.detail));
}