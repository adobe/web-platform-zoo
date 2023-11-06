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

class IncDecInput extends HTMLElement {
  static observedAttributes = ['value'];
  static template = document.createElement('template');
  static {
    IncDecInput.template.innerHTML = `
    <style>
      span {
        padding-top: 0.2em;
        padding-bottom: 0.1em;
      }
      ::slotted(button) {
        display: inline;
        background-color: var(--cart-product-button-bg, orange);
        color: var(--cart-product-button-fg, black);
        border-radius: var(--cart-product-button-corner-radius, 5px);
        font-size: var(--cart-product-button-font-size, 100%);
      }
      ::slotted(input) {
        display: inline;
        font-size: var(--cart-product-button-font-size, 100%);
      }
    </style>
    <span role='slider' aria-label='in cart'>
      <slot></slot>
    </span>
  `;
  }

  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.eventName = this.getAttribute('event');
    this.shadowRoot.append(IncDecInput.template.content.cloneNode(true));

    // for itemId, use the itemid of the closest itemscope element
    const eId = this.closest('*[itemscope]');
    if (eId) {
      this.itemID = eId.getAttribute('itemid');
    }

    // setup input field
    this.input = this.querySelector('input');
    if (this.input) {
      this.input.value = this.count;
      this.input.addEventListener('keyup', e => this._setCount(e.key));
    }

    // setup all buttons found inside this
    this.querySelectorAll('button').forEach(b => b.addEventListener('click', this._setCount.bind(this, b.textContent)));
  }

  attributeChangedCallback(name, _oldValue, newValueIn) {
    if (name === 'value') {
      const newValue = Number(newValueIn);
      if (!isNaN(newValue) && newValue != this.count) {
        this.count = newValue;
        if (this.input) {
          this.input.value = newValue;
        }
      }
    }
  }

  _setCount(cmd) {
    var delta = 0;
    if (cmd == 'ArrowUp' || cmd == '+') {
      delta = '1';
    } else if (cmd == 'PageUp') {
      delta = 10;
    } else if (cmd == 'ArrowDown' || cmd == '-') {
      delta = '-1';
    } else if (cmd == 'PageDown') {
      delta = -10;
    }
    const oldCount = this.count;
    if (!isNaN(delta)) {
      this.count += Number(delta);
    } else {
      const v = Number(this.input.value);
      if (!isNaN(v)) {
        this.count = v;
      }
    }
    this.count = Math.floor(Math.max(0, this.count));
    if (this.count != oldCount) {
      const detail = { productID: this.itemID, count: this.count };
      window.dispatchEvent(new CustomEvent(this.eventName, { detail }));
    }
    this.input.value = this.count;

    //this.slider.setAttribute('aria-valuenow', `${this.count}`);
  }
}

customElements.define('inc-dec-input', IncDecInput);