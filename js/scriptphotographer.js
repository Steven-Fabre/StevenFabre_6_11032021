"use strict";
// Declaration de variables hors du fichier JSON
let currentMediaList = [];
let check;
let launchViewer;
let cards; // Sera la sélection de tous les média (à actualiser à chaque filtre)
let cardsArray; // Sera la transformation de la sélection en Array
let indexo; // Sera l'index de l'objet/média actuel
let likesTotal = 0;
let dropdown = document.getElementById("trier-par");

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
    let photoArticle = document.getElementById("photo");
    let photographerProfil = document.getElementById("profil");
    let container = document.getElementById("container");
    // Variables pour le Carousel d'image
    let viewer = document.getElementById("viewer");
    let closeViewer = document.getElementById("croixviewer");
    let images = document.querySelectorAll(".media");
    let precedent = document.getElementById("flechegauche");
    let suivant = document.getElementById("flechedroite");
    // Compteur de likes
    const compteur = document.getElementById("compteur");
    const photographerPrice = document.getElementById("photographerPrice");

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

    // Avoir le premier mot du nom du photographe (pour chercher le dossier photo)
    function getFirstWord(str) {
      let spaceIndex = str.indexOf(" ");
      return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
    }

    // Function principale qui recompose les images par rapport aux filtres et au tri
    check = function () {
      dropdown = document.getElementById("trier-par");
      let value = dropdown.value;
      // On supprime l'ancienne list
      while (photoArticle.firstChild) {
        photoArticle.removeChild(photoArticle.firstChild);
      }
      // On regarde l'Option choisi
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
      // On recrée la liste de médias
      for (let i in currentMediaList) {
        currentMedia = currentMediaList[i];
        photoArticle.insertAdjacentHTML(
          "beforeend",
          `<div id=${currentMedia.id} class ="mediaCard ${currentMedia.tags}">
          <div class="photoDescription">
          <p>${currentMedia.title}</p>
          <div class="likesCount" >
          <p class="numberLike">${currentMedia.likes}</p>
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
            `<img class="media" alt=${currentMedia.title} id="media${currentMedia.id}" src="./img/${folderName}/${currentMedia.image}">`
          );
        }
        if (currentMedia.video) {
          currentId.insertAdjacentHTML(
            "afterBegin",
            `<video  class="media" alt="${currentMedia.title}"  id="media${currentMedia.id}" src="./img/${folderName}/${currentMedia.video}"> <p>Votre navigateur ne supporte pas la lecture du média, voici à la place un <a href="./img/${folderName}/${currentMedia.video}">lien de la vidéo</a> à télécharger</p></video>`
          );
        }
        // On regarde le compteur pour vérifier si les photos ont déjà été likées
        if (compteur.classList.contains(`media${currentMedia.id}`)) {
          document.getElementById(`${currentMedia.id}`).classList.add("loved");

          let photoLike = parseInt(
            document
              .getElementById(`${currentMedia.id}`)
              .querySelector(".numberLike").innerHTML
          );
          photoLike++;
          document;
          document
            .getElementById(`${currentMedia.id}`)
            .querySelector(".numberLike").innerHTML = photoLike;
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
      <button id="btn-modal" title="Contactez-moi" class="btn-modal toggle-modal">Contactez-moi</button>
      </div>
      <h3>"${currentPhotographer.city},${currentPhotographer.country}"</h3>
      <h4>"${currentPhotographer.tagline}"</h4>
      <div id="tags"></div>
      </div>
      <img class="profilpic" alt="photo de profil de ${currentPhotographer.name}" src="./img/IDPhotos/${currentPhotographer.portrait}">`
    );

    // Création des boutons de tags
    for (let tag in currentPhotographer.tags) {
      let tagBtn = document.createElement("a");
      document.getElementById("tags").appendChild(tagBtn);
      tagBtn.setAttribute(`value`, `${currentPhotographer.tags[tag]}`);
      tagBtn.setAttribute("class", `filters`);
      tagBtn.setAttribute("alt", `${currentPhotographer.tags[tag]}`);
      tagBtn.innerHTML = `#${currentPhotographer.tags[tag]}`;
    }

    let modalName = document.querySelector(".modalname");
    modalName.textContent = `${currentPhotographer.name}`;

    function commandViewer(mediaElement) {
      // ENLEVER L'image du viewer si il y en a une
      lastIndex = cardsArray.length - 1;
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
          <p>Votre navigateur ne supporte pas la lecture du média, voici à la place un <a href="${mediaElement.src}">lien de la vidéo</a> à télécharger</p>
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
        commandViewer(cardsArray[lastIndex]);
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
    compteur.innerHTML = likesTotal;
    photographerPrice.innerHTML = `${currentPhotographer.price}€ / jour`;

    // Ecoute des évenements
    document.addEventListener("click", function (event) {
      cards = document.getElementsByClassName("media");
      cardsArray = Array.from(cards);
      // OPEN AND CLOSE CONTACT MODAL
      if (event.target.classList.contains("toggle-modal")) {
        document.getElementById("modal").classList.toggle("hidden");
      }
      if (event.target.classList.contains("media")) {
        //Récupérer le bon média dans la liste de média en séléctionnant par son index
        indexo = cardsArray.findIndex(
          (object) => object.src === event.target.src
        );
        commandViewer(cardsArray[indexo]);
      }
      // Ecoute du click de likes
      if (event.target.closest("div.likesCount")) {
        let target = event.target;
        let grandParentNode =
          target.closest("div.likesCount").parentNode.parentNode;
        let mediao = cardsArray.find(
          (object) => object.id == `media${grandParentNode.id}`
        );
        likeFunc(target, mediao);
      }
      // Ecoute de l'application des filtres
      if (event.target.classList.contains("filters")) {
        let value = event.target.innerHTML.substr(1);
        filterChange(value);
      }
    });
  });
let likeFunc = (target, mediao) => {
  let grandParentNode = target.closest("div.likesCount").parentNode.parentNode;
  let photoLike = target.closest("div.likesCount").querySelector("p");
  let photoScore = parseInt(photoLike.innerHTML);
  // Si le like est déjà actif
  if (grandParentNode.classList.contains("loved")) {
    // On ajout au compteur l'id du like
    compteur.classList.remove(mediao.id);
    grandParentNode.classList.remove("loved");
    likesTotal--;
    compteur.innerHTML = likesTotal;
    // On enlève le like sur la photo
    photoScore--;
    photoLike.innerHTML = photoScore;
  } else {
    compteur.classList.add(mediao.id);
    grandParentNode.classList.add("loved");
    likesTotal++;
    compteur.innerHTML = likesTotal;
    photoScore++;
    photoLike.innerHTML = photoScore;
  }
};

// ECOUTE DES FILTRES
function filterChange(event) {
  check();
  // Application des filtres
  let photoArticle = document.getElementById("photo");
  let returnButton = document.getElementById("return");
  cards = document.querySelectorAll(".mediaCard");
  returnButton.classList.remove("hidden");
  cards.forEach((card) => {
    if (!card.classList.contains(`${event}`)) {
      photoArticle.removeChild(card);
    }
  });
}
