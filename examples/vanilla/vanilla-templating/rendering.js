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

// the htm library is used to escape HTML. We could use a more minimalistic escape
// function such as @wordpress/escape-html, but the html`` syntax helps
// avoid forgetting to escape data, and that library is quite small.
import htm from "https://cdn.skypack.dev/htm@3.1.1";
import vhtml from "https://cdn.skypack.dev/vhtml@2.2.0";
const html = htm.bind(vhtml);

let currentActivity = null;
let currentData = {};
const initialTitle = document.getElementById("mainTitle").textContent;

const renderSingleCard = (card) => {
  return html`
    <div class="result-card">
      <img src="${card.primaryImage?._publishUrl}"></img>
      <h2>${card.title}</h2>
      <h3>${card.tripLength} / $${card.price}</h3>
    </div>
  `;
};

const renderSelectedCards = () => {
  let cardsHtml = "";
  currentData?.adventureList?.items
    .filter((card) => !currentActivity || card.activity == currentActivity)
    .map((card) => (cardsHtml += renderSingleCard(card)));
  document.getElementById("results").innerHTML = cardsHtml;

  const title = `${initialTitle} ${currentActivity ? ": " + currentActivity : ""
    }`;
  document.getElementById("mainTitle").innerHTML = title;
  document.title = title;
};

const activityButtonClicked = (e) => {
  const clicked = e.target?.textContent.trim();
  currentActivity = clicked == currentActivity ? null : clicked;
  document.querySelectorAll("#activities li").forEach((activity) => {
    activity.setAttribute(
      "class",
      activity.textContent.trim() == currentActivity ? "selected" : ""
    );
  });
  renderSelectedCards();
};

const initialRendering = adventures => {
  currentData = adventures.data;

  // Setup the activities menu
  let activitiesMenu = "";
  let activities = {};
  currentData?.adventureList?.items.map((card) => {
    activities[card.activity] = true;
  });
  Object.keys(activities)
    .sort()
    .map(
      (a) =>
      (activitiesMenu += html`
    <li>${a}</li>
  `)
    );
  document.getElementById("activities").innerHTML = activitiesMenu;
  document.querySelectorAll("#activities li").forEach((e) => {
    e.addEventListener("click", activityButtonClicked);
  });

  // And render the list of cards
  renderSelectedCards();
}

// get the data, which in a real case we'd probably fetch from
// a service URL, and render the page
const dataSource = document.querySelector("#results").getAttribute("data-source");
fetch(dataSource)
  .then(response => response.json())
  .then(json => initialRendering(json))
;