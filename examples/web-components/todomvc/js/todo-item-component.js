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

const styles = `
li {
	position: relative;
	font-size: 24px;
	border-bottom: 1px solid #ededed;
}

li:last-child {
	border-bottom: none;
}

.editing {
	border-bottom: none;
	padding: 0;
}

.editing .edit {
	display: block;
	width: calc(100% - 143px);
	padding: 12px 16px;
	margin: 0 0 0 43px;
}

.editing .view {
	display: none;
}

li .toggle {
	text-align: center;
	width: 40px;
	/* auto, since non-WebKit browsers doesn't support input styling */
	height: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto 0;
	border: none; /* Mobile Safari */
	-webkit-appearance: none;
	appearance: none;
}

li .toggle {
	opacity: 0;
}

li .toggle + label {
  /*
    Firefox requires '#' to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
    IE and Edge requires *everything* to be escaped to render, so we do that instead of just the '#' - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
  */
	background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
	background-repeat: no-repeat;
	background-position: center left;
}

li .toggle:checked + label {
	background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E');
}

li label {
	word-break: break-all;
	padding: 15px 15px 15px 60px;
	display: block;
	line-height: 1.2;
	transition: color 0.4s;
	font-weight: 400;
	color: var(	--todo-item-color-active, blue);
}

li.completed label {
	color: var(	--todo-item-color-completed, grey);
	text-decoration: line-through;
}

li .edit {
	display: none;
}

li.editing:last-child {
	margin-bottom: -1px;
}


li .destroy {
	display: none;
	position: absolute;
	top: 0;
	right: 10px;
	bottom: 0;
	width: 40px;
	height: 40px;
	margin: auto 0;
	font-size: 30px;
	color: var(--todo-item-color-destroy-button, black);
	transition: color 0.2s ease-out;
}

li .destroy:hover,
li .destroy:focus {
	color: var(--todo-color-hover-element, #C18585);
}

li .destroy:after {
	content: '×';
	display: block;
	height: 100%;
	line-height: 1.1;
}

li:hover .destroy {
	display: block;
}
`;

class TodoItem extends HTMLElement {
  #item;
  #text;

  connectedCallback() {
    // TODO this should ideally be "closed" but how to test that with Playwright?
    const shadowRoot = this.attachShadow({mode:"open"});
    const style = shadowRoot.appendChild(document.createElement('style'));
    style.innerHTML = styles;
    this.#item = document.createElement('li');
    this.#text = this.textContent;
    this.textContent = '';
    shadowRoot.append(this.#item);
    this._render();
  }

	_setupEditing(li, id) {
		const label = li.querySelector("label");
		const textInput = li.querySelector('[data-todo="edit"]');
		label.addEventListener("dblclick", () => {
			li.classList.add("editing");
			textInput.value = label.textContent;
			textInput.focus();
		});
		textInput.addEventListener("keyup", (e) => {
			if(e.key === "Enter" && textInput.value) {
				li.classList.remove("editing");
				window.todomvc.store.update({id:id, title:textInput.value});
			}
			if (e.key === "Escape") {
				document.activeElement.blur();
			}
		});
		textInput.addEventListener("focusout", () => {
			li.classList.remove("editing");
		});
	}

  _render() {
    const id = this.getAttribute('id');
    const completed = this.getAttribute('completed');
    this.#item.innerHTML = `
      <div class="view">
				<input class='toggle' type='checkbox' ${completed ? 'checked' : ''}>
				<label></label>
				<button class='destroy'></button>
			</div>
			<input data-todo="edit" class="edit">
    `;

    this.#item.classList = completed ? 'completed' : '';

		// Ensure proper text escaping
		this.#item.querySelector('label').appendChild(document.createTextNode(this.#text));

		// Activate buttons and editing
    this.#item.querySelector('.toggle').addEventListener('click', () => { window.todomvc.store.toggle({id}); });
    this.#item.querySelector('button').addEventListener('click', () => { window.todomvc.store.remove({id}); });
		this._setupEditing(this.#item, id);
  }
}

customElements.define('todo-item', TodoItem);