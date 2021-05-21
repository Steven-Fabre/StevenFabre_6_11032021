"use strict";
// Declaration de variables hors du fichier JSON
let currentMediaList = [];
let check;
let launchViewer;
let cardsArray;
let indexo;
// Compteur de likes
let likesTotal = 0;
// Ecoute du bouton ECHAP pour fermer la modal
document.addEventListener("keydown", (e) =>
  e.code == "Escape" ? modal.classList.add("hidden") : ""
);

fetch("./js/data.json")
  .then((resp) => resp.json())
  .then(function (data) {
    // ___________ Declaration des variables __________
    let idPage = window.location.hash.substring(1);
    let photographersArray = data.photographers;
    let mediaArray = data.media;
    let currentPhotographer;
    let currentMedia;
    let currentId;
    let photographerProfil = document.getElementById("profil");
    let photoArticle = document.getElementById("photo");
    let container = document.getElementById("container");
    // Variables pour le Carousel d'image
    let viewer = document.getElementById("viewer");
    let closeViewer = document.getElementById("croixviewer");
    let images = document.querySelectorAll(".media");
    let precedent = document.getElementById("flechegauche");
    let suivant = document.getElementById("flechedroite");

    // _________ Declaration des fonctions
    //TRI PAR TITRE

    let sortByTitle = function () {
      currentMediaList.sort(function (a, b) {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    };
    ////  TRI PAR DATE
    let sortByDate = function () {
      currentMediaList.sort(function (a, b) {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
    };
    // // TRI PAR POPULARITE
    let sortByPopularity = function () {
      currentMediaList.sort(function (a, b) {
        if (a.likes > b.likes) {
          return -1;
        }
        if (a.likes < b.likes) {
          return 1;
        }
        return 0;
      });
    };

    function getFirstWord(str) {
      let spaceIndex = str.indexOf(" ");
      return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
    }
    check = function () {
      dropdown = document.getElementById("trier-par");
      let value = dropdown.value;
      while (photoArticle.firstChild) {
        photoArticle.removeChild(photoArticle.firstChild);
      }
      switch (value) {
        case "popularite":
          sortByPopularity();
          break;
        case "date":
          sortByDate();
          break;
        case "titre":
          sortByTitle();
          break;
      }
      for (let i in currentMediaList) {
        currentMedia = currentMediaList[i];
        photoArticle.insertAdjacentHTML(
          "beforeend",
          `<div id=${currentMedia.id} class ="mediaCard ${currentMedia.tags}">
          <div class="photoDescription">
          <p>${currentMedia.title}</p>
          <div class="likesCount" onclick="likeFunc(this)">
          <p>${currentMedia.likes}</p>
          <i class="fas fa-heart" aria-label="likes"></i>
          </div>
          </div>
          </div>`
        );
        currentId = document.getElementById(`${currentMedia.id}`);
        // Creer le media suivant si c'est une photo ou une video
        if (currentMedia.image) {
          currentId.insertAdjacentHTML(
            "afterBegin",
            `<img class="media" alt=${currentMedia.title} src="./img/${folderName}/${currentMedia.image}">`
          );
        }
        if (currentMedia.video) {
          currentId.insertAdjacentHTML(
            "afterBegin",
            `<video class="media" alt="${currentMedia.title}" src="./img/${folderName}/${currentMedia.video}"></video>`
          );
        }

        // Créer le total des likes en rajoutant à chaque itération
        function totalLikes() {
          likesTotal = currentMediaList.reduce(function (accumulator, item) {
            return accumulator + item.likes;
          }, 0);
        }
        totalLikes();
      }
    };

    // Definir le photographe actuel et ses média correspondants

    for (let i in photographersArray) {
      if (photographersArray[i].id == idPage) {
        currentPhotographer = photographersArray[i];
      }
    }
    let folderName = getFirstWord(`${currentPhotographer.name}`);
    for (let i in mediaArray) {
      if (mediaArray[i].photographerId == idPage) {
        currentMediaList.push(mediaArray[i]);
      }
    }

    // Création de la carte Profil
    photographerProfil.insertAdjacentHTML(
      "beforeend",
      `<div id="description">
      <div id="contact">
      <h1>"${currentPhotographer.name}"</h1>
      <button id="btn-modal" class="btn-modal toggle-modal">Contactez-moi</button>
      </div>
      <h3>"${currentPhotographer.city},${currentPhotographer.country}"</h3>
      <h4>"${currentPhotographer.tagline}"</h4>
      <div id="tags"></div>
      </div>
      <img class="profilpic" src="./img/IDPhotos/${currentPhotographer.portrait}">`
    );
    for (let tag in currentPhotographer.tags) {
      let tagBtn = document.createElement("a");
      document.getElementById("tags").appendChild(tagBtn);
      tagBtn.setAttribute(`value`, `${currentPhotographer.tags[tag]}`);
      tagBtn.setAttribute("href", `#${currentPhotographer.tags[tag]}`);
      tagBtn.setAttribute("class", `filters`);
      tagBtn.innerHTML = `#${currentPhotographer.tags[tag]}`;
    }

    let modalName = document.querySelector(".modalname");
    modalName.textContent = `${currentPhotographer.name}`;

    function commandViewer(mediaElement) {
      // ENLEVER L'image du viewer si il y en a une
      while (viewer.firstChild) {
        viewer.removeChild(viewer.firstChild);
      }
      container.classList.add("active");
      if (mediaElement.tagName == "IMG") {
        viewer.insertAdjacentHTML(
          "beforeend",
          `<img src=${mediaElement.src} id=${mediaElement.id} alt=${mediaElement.alt}>
          <p>${mediaElement.alt}</p>`
        );
      }
      if (mediaElement.tagName == "VIDEO") {
        viewer.insertAdjacentHTML(
          "beforeend",
          `<video src=${mediaElement.src} id="${mediaElement.id}"  controls="controls">
            <source id='mp4Source' src="movie.mp4" type="video/mp4" />
            <source id='oggSource' src="movie.ogg" type="video/ogg" />
            </video>
            <p>${mediaElement.title}</p>`
        );
      }
    }
    check();
    // ______ Ecoute du click sur les images ________
    images = document.querySelectorAll(".media");
    let indexo;
    let index;
    let lastIndex;
    let lastMedia;
    for (let i in currentMediaList) {
      currentMedia = currentMediaList[i];
      index = i;
      lastIndex = currentMediaList.length - 1;
    }

    // PASSER A L'IMAGE PRECEDENTE
    precedent.addEventListener("click", function () {
      getPrevious();
    });
    function getPrevious() {
      lastMedia = cardsArray[lastIndex];

      // Si il y a une image avant
      if (cardsArray[indexo - 1]) {
        commandViewer(cardsArray[indexo - 1]);
        indexo = indexo - 1;
      } else {
        // Sinon afficher la dernière photo
        commandViewer(lastMedia);
        indexo = lastIndex;
      }
    }

    // PASSER A L'IMAGE SUIVANTE
    suivant.addEventListener("click", function () {
      getNext();
    });

    function getNext() {
      lastMedia = cardsArray[lastIndex];

      // Si il y a une image après
      if (cardsArray[indexo + 1]) {
        commandViewer(cardsArray[indexo + 1]);
        indexo = indexo + 1;
      } else {
        // Sinon afficher la première photo
        commandViewer(cardsArray[0]);
        indexo = 0;
      }
    }
    // ECOUTE DES TOUCHES DE NAVIGATION
    document.addEventListener("keydown", (e) => {
      if (e.code == "Escape") container.classList.remove("active");
      else if (e.code == "ArrowLeft") {
        getPrevious();
      } else if (e.code == "ArrowRight") {
        getNext();
      }
    });

    // Fermer le viewer
    closeViewer.addEventListener("click", (e) => {
      container.classList.remove("active");
    });
    // Ajout du compteur de likes et tarifs
    document
      .getElementById("description")
      .insertAdjacentHTML(
        "afterend",
        `<div class="footer"><div><p id="compteur">${likesTotal}<p><i class="fas fa-heart" aria-label="likes"></i></div> <p>${currentPhotographer.price}€ / jour</div>`
      );

    // Ecoute des évenements
    document.addEventListener("click", function (event) {
      // OPEN AND CLOSE CONTACT MODAL
      if (event.target.classList.contains("toggle-modal")) {
        document.getElementById("modal").classList.toggle("hidden");
      }
      if (event.target.classList.contains("media")) {
        let cards = document.getElementsByClassName("media");
        cardsArray = Array.from(cards);
        indexo = cardsArray.findIndex(
          (object) => object.src === event.target.src
        );
        commandViewer(cardsArray[indexo]);
      }
    });
  });
let likeFunc = (button) => {
  let compteur = document.getElementById("compteur");
  if (button.classList.contains("loved")) {
    button.classList.remove("loved");
    likesTotal--;
    compteur.innerHTML = likesTotal;
  } else {
    button.classList.add("loved");
    likesTotal++;
    compteur.innerHTML = likesTotal;
  }
};

// ECOUTE DES FILTRES
window.onhashchange = hashChange;
function hashChange() {
  let returnButton = document.getElementById("return");
  let linkFilter = window.location.hash.substring(1);
  let cards = document.getElementsByClassName("mediaCard");
  returnButton.classList.remove("hidden");
  if (window.location.hash) {
    for (let card of cards) {
      if (card.classList.contains(`${linkFilter}`)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    }
  }
}

let dropdown = document.getElementById("trier-par");
