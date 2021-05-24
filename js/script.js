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

      //Fonction générique de création de contenu à partir des objets JSON
      function insertElement(elementType, innerContent, parentDiv) {
        let el = document.createElement(elementType);
        el.innerHTML = innerContent;
        parentDiv.appendChild(el);
      }
      // Fonction générique de création de carte à partir des objets JSON
      function createDiv(
        elementType,
        innerAttClass,
        innerAttContent,
        idName,
        parentDiv
      ) {
        let element = document.createElement(elementType);
        element.setAttribute(innerAttClass, innerAttContent);
        element.setAttribute("id", idName);
        parentDiv.appendChild(element);
      }
      //Crée une Div avec le nom du photographe
      createDiv(
        "article",
        "class",
        `photographerCard mediaCard`,
        `${i.name}`,
        resultDiv
      );
      let nameDiv = document.getElementById(i.name);
      let name = document.createElement("h2");
      name.innerHTML = `${i.name}`;
      // Création du profil cliquable
      let link = document.createElement("a");
      nameDiv.appendChild(link);
      link.href = `photographer.html#${i.id}`;
      link.appendChild(name);
      name.insertAdjacentHTML(
        "beforebegin",
        `<img class="profilpic" alt="${i.name}" src="./img/IDPhotos/${i.portrait}">`
      );
      // Création de la localisation
      insertElement("p", `${i.city}, ${i.country}`, nameDiv);
      // Création de la tagline
      insertElement("p", `${i.tagline}`, nameDiv);
      // Création du prix
      insertElement("p", `${i.price}€/jour`, nameDiv);

      // Création des tags
      createDiv("div", "class", `tags`, `${i.id}`, nameDiv);
      for (let tag in i.tags) {
        let tagBtn = document.createElement("a");
        let tagDiv = document.getElementById(i.id);
        tagDiv.appendChild(tagBtn);
        tagBtn.setAttribute(`value`, `${i.tags[tag]}`);
        tagBtn.setAttribute("class", `filters`);
        tagBtn.setAttribute("href", `#${i.tags[tag]}`);
        tagBtn.classList.add(`#${i.tags[tag]}`);
        tagBtn.innerHTML = `#${i.tags[tag]}`;
        nameDiv.classList.add(`${i.tags[tag]}`);
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
  }
}
