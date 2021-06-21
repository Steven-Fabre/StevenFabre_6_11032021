"use strict";
let newStrong = document.createElement("strong");
let newLink = document.createElement("a");

// Récupère les données du fichier JSON
fetch("./js/data.json")
  .then((resp) => resp.json())
  .then(function display(data) {
    let photographersArray = data.photographers;

    for (let i of photographersArray) {
      let resultDiv = document.getElementById("resultDiv");
      resultDiv.insertAdjacentHTML(
        "beforeend",
        `<article id="${i.name}" class ="photographerCard mediaCard ">
          <a href="photographer.html#${i.id}">
          <img class="profilpic" alt="${i.name}" src="./img/IDPhotos/${i.portrait}">
          <h2>${i.name}</h2>
          </a>
          <p>${i.city}, ${i.country}</p>
          <p>${i.tagline}</p>
          <p>${i.price}€/jour</p>
          </article>`
      );

      // Création des tags
      document
        .getElementById(`${i.name}`)
        .insertAdjacentHTML(
          "beforeend",
          `<div class="tags" id="${i.id}"></div>`
        );

      for (let tag in i.tags) {
        let tagDiv = document.getElementById(i.id);
        let nameArticle = document.getElementById(`${i.name}`);
        nameArticle.classList.add(`${i.tags[tag]}`);
        tagDiv.insertAdjacentHTML(
          "beforeend",
          `<a value=${i.tags[tag]} class="filters #${i.tags[tag]}" href="#${i.tags[tag]}" title="${i.tags[tag]}">#${i.tags[tag]}</a>`
        );
      }
    }
    hashChange();
  });
window.onhashchange = hashChange;
function hashChange() {
  if (window.location.hash) {
    let linkFilter = window.location.hash.substring(1);
    let cards = document.getElementsByClassName("photographerCard");
    for (let card of cards) {
      if (card.classList.contains(`${linkFilter}`)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    }

    document.getElementById("return").classList.remove("hidden");
  }
}

function resetFilter() {
  location.replace("index.html");
}
