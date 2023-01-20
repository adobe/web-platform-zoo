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

class TodoList extends HTMLElement {
  #listRoot;

  connectedCallback() {
    this.#listRoot = document.createElement("ul");
    this.#listRoot.setAttribute("class", "todo-list");
    this.append(this.#listRoot);
    window.todomvc.store.addEventListener('save', this._render.bind(this));
    window.addEventListener('todomvc-filter', this._render.bind(this));
    this._render();
  }

  _render() {
    const currentFilter = this._getFilter(document.location.hash);
    this.#listRoot.innerHTML = '';
    for(let todo of window.todomvc.store.all(currentFilter)) {
      const e = document.createElement('todo-item');
      e.setAttribute('id', todo.id);
      if(todo.completed) {
        e.setAttribute('completed','true');
      }
      e.textContent = todo.title;
      this.#listRoot.appendChild(e);
    };
  }

  _getFilter(url) {
    return url.replace(/.*#\//, "");
  }
}

customElements.define('todo-list', TodoList);