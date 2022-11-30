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

const render = (indexElement, examples) => {
  let html = "<ul>";
  for(let example of examples.examples) {
    if(example.path) {
      html += `
        <li>
          <a href="${example.path}">${example.data.name}</a>
          <span class="tags">(${example.data.tags.join(',')})</span>
        </li>
      `;
    }
    
  }
  html += "</ul>";
  indexElement.innerHTML = html
}

// get the data, which in a real case we'd probably fetch from
// a service URL, and render the page
fetch('./examples.json')
  .then(response => response.json())
  .then(examples => render(document.getElementById("examples"), examples))
;