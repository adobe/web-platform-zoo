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

// Thanks to Christian Heilmann's for his ideas and examples at
// http://christianheilmann.com/2015/04/08/keeping-it-simple-coding-a-carousel/
// which has much more detailed options and variants.

const css = `
  ul {
    list-style-type: none;
  }
  li {
    text-align: center;
    display: none;
    width: 100%;
    text-align: center;
  }
  .current {
    display: block;
  }
  img {
    width: 100%;
    text-align: center;
  }
  .buttons {
    width: 100%;
    text-align: center;
    z-index: 10;
  }
  figcaption {
    font-style: italic;
    font-size: 80%;
  }
  .offscreen {
    position: absolute;
    left: -2000px;
  }
`;

const buttonsHTML = `
  <button class="prev">
    &lt;--<span class="offscreen">Previous</span>
  </button>
  <button class="next">
    <span class="offscreen">Next</span>--&gt;
  </button>
`
class SimpleCarousel extends HTMLElement {
  #shadow;
  #current;
  #items;
  #index;

  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement('style');
    style.textContent = css;
    this.#shadow.appendChild(style);

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    buttons.innerHTML = buttonsHTML;
    this.#shadow.appendChild(buttons);

    this.#shadow.appendChild(this.querySelector('ul'));

    this.#items = this.#shadow.querySelectorAll('li');
    this.#current = this.#items[0];

    // Provide an event-driven way to navigate 
    this.addEventListener('carousel-next', (e) => { 
      this.#navigate(1) 
    });
    this.addEventListener('carousel-previous', (e) => { 
      this.#navigate(-1) 
    });

    // And connect next/prev buttons to that
    this.#shadow.querySelector('.next').addEventListener('click', () => { 
      this.dispatchEvent(new CustomEvent('carousel-next'))
    });
    this.#shadow.querySelector('.prev').addEventListener('click', () => { 
      this.dispatchEvent(new CustomEvent('carousel-previous')) 
    });

    this.#index = 0;
    this.#navigate(0);
  }

  #navigate(increment=1) {
    this.#current.classList.remove('current');
    this.#index += increment;
    if(this.#index >= this.#items.length) {
      this.#index = 0;
    }
    if(this.#index < 0) {
      this.#index = this.#items.length - 1;
    }
    this.#current = this.#items[this.#index];
    this.#current.classList.add('current');

    // Expose these for testing and scripting
    this.setAttribute('data-current-caption', this.#current.querySelector('figcaption').textContent);
    this.setAttribute('data-current-src', this.#current.querySelector('img').src);
  }
}

customElements.define('simple-carousel', SimpleCarousel);