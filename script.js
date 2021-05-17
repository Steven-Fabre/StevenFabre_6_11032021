"use strict";
// let json = JSON.parse();
// console.log(json);

// $.get(data.json, function () {
//   console.log(data.json);
// });

let newStrong = document.createElement("strong");
let newLink = document.createElement("a");

// Récupère les données du fichier JSON
fetch("./data.json")
  .then((resp) => resp.json())
  .then(function (data) {
    for (let i of data.photographers) {
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
      createDiv("div", "class", `photographerCard`, `${i.name}`, resultDiv);
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
        `<img class="profilpic" src="./img/IDPhotos/${i.portrait}">`
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
        let tagBtn = document.createElement("button");
        let tagDiv = document.getElementById(i.id);
        tagDiv.appendChild(tagBtn);
        tagBtn.setAttribute(`value`, `${i.tags[tag]}`);
        tagBtn.setAttribute("class", `filters`);
        tagBtn.innerHTML = `#${i.tags[tag]}`;
        nameDiv.classList.add(`${i.tags[tag]}`);
      }
    }
  });
// Mise en place des filtres
// Ecoute le clique sur filtres
window.addEventListener("load", btnListener);

// Fonction d'écoute de chaque bouton
function btnListener() {
  let btnFilters = document.getElementsByClassName("filters");
  for (var i = 0; i < btnFilters.length; i++) {
    btnFilters[i].addEventListener("click", getFilter);
  }
}

// Fonction d'application du filtre
function getFilter() {
  // let photographerCard = document.querySelectorAll(".photographerCard");
  let cards = document.getElementsByClassName("photographerCard");
  let filterRemover = document.getElementById("removeFilters");
  let filterValue = document.getElementsByClassName(`${this.value}`);
  for (let card of cards) card.classList.add("hideCard");
  for (let goodValue of filterValue) goodValue.classList.remove("hideCard");
  // function toggleCard(selector, toggle) {
  //   for (let photographer of selector) {
  //     photographer.style.display = toggle;
  //   }
  // }
  // // Cache toutes les cartes de photographes
  // toggleCard(photographerCard, "none");
  // // Affiche les cartes des photographes avec le tag
  // toggleCard(filterValue, "flex");
  // // Affiche le bouton pour réinitialiser les filtres
  // filterRemover.style.display = "flex";
  // Si on clique sur le bouton de réinitialisation, alors toutes les cartes s'affichent et le bouton disparait
  if (this.value == "photographerCard") {
    filterRemover.classList.add("hideCard");
  }
}

// _____________________________ PAGE PHOTOGRAPHE _______________________
