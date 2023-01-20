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

import { TodoStore } from './store.js';

(function (window) {
	'use strict';
	if(!window.todomvc) {
		window.todomvc = {};
	}
  const store = new TodoStore('todomvc-bertrand-web-components');
	window.todomvc.store = store;

	if(store.count() == 0) {
		store.add({title:'Rule the world'});
		store.add({title:'Rewrite the rules'});
		store.toggle({id:store.add({title:'This is done'})});
	/*	
	} else {
		store.clearCompleted();
		store.toggleAll();
		store.clearCompleted();
	*/	
	}

	document.querySelector('[data-todo="new"]').addEventListener("keyup", (e) => {
		if (e.key === "Enter" && e.target.value.length) {
			store.add({ title: e.target.value});
			e.target.value = '';
		}
	});

	document.querySelector('[data-todo="clear-completed"]').addEventListener("click", (e) => {
		store.clearCompleted();
	});

	document.querySelector('#toggle-all').addEventListener("click", (e) => {
		store.toggleAll();
	});

	const hideIfNone = () => {
		const hide = store.count() <= 0;
		document.querySelectorAll('[data-todo="hide-if-none"]').forEach(e => {
			if(hide) {
				e.classList.add("hidden");
			} else {
				e.classList.remove("hidden");
			}
	
		})
	};
	store.addEventListener('save', () => hideIfNone());
	hideIfNone();

	const updateCount = () => document.querySelector('[data-todo="count"]').innerHTML = `<strong>${store.count()}</strong> items left`;
	store.addEventListener('save', () => updateCount());
	updateCount();
})(window);
