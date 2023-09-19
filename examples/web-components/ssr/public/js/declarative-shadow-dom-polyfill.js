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

// DSD polyfill inspired by https://developer.chrome.com/articles/declarative-shadow-dom/
(function() {
  const shadowRootAttr = "shadowroot";

  if(HTMLTemplateElement.prototype.hasOwnProperty("shadowRoot")) {
    console.log("DSD polyfill not needed");
    return;
  }

  const attachShadowRoots = root => {
    root.querySelectorAll(`template[${shadowRootAttr}]`).forEach(template => {
      console.log('processing', template);
      const mode = template.getAttribute(shadowRootAttr)
      const shadowRoot = template.parentNode.attachShadow({ mode });
      shadowRoot.appendChild(template.content);
      template.remove();
      attachShadowRoots(shadowRoot);
    })
  };

  console.log("Activating DSD polyfill");
  window.addEventListener("DOMContentLoaded", e => attachShadowRoots(document));
})();
