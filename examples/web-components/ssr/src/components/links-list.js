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

class LinksList extends HTMLElement {
  connectedCallback() {
    const style = document.createElement('style');
    style.textContent = 'h3 { color:blue }';
    const shadowRoot = this.attachShadow({mode:"open"});
    shadowRoot.appendChild(style);
    const h3 = document.createElement('h3');
    h3.textContent = 'This should be blue, if DSD works';
    shadowRoot.appendChild(h3);
    const slot = document.createElement('slot');
    shadowRoot.appendChild(slot);

  }
}
customElements.define('links-list', LinksList);
