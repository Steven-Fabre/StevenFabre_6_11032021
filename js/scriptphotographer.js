"use strict";
let currentMediaList = [];
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

    // Compteur de likes
    let likesTotal = 0;

    for (let i in photographersArray) {
      if (photographersArray[i].id == idPage) {
        currentPhotographer = photographersArray[i];
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

    // _______________ Afficher les photos __________

    function getFirstWord(str) {
      let spaceIndex = str.indexOf(" ");
      return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
    }

    let folderName = getFirstWord(`${currentPhotographer.name}`);
    for (let i in mediaArray) {
      if (mediaArray[i].photographerId == idPage) {
        currentMediaList.push(mediaArray[i]);
      }
    }

    sortByPopularity();
    // dropdown.addEventListener("change", check());

    for (let i in currentMediaList) {
      currentMedia = currentMediaList[i];
      photoArticle.insertAdjacentHTML(
        "beforeend",
        `<div id=${currentMedia.id} class ="mediaCard ${currentMedia.tags}">
        <div class="photoDescription">
        <p>${currentMedia.title}</p>
        <div class="likesCount">
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

      likesTotal += currentMedia.likes;
    }

    // OPEN AND CLOSE CONTACT MODAL
    let modalOpener = document.querySelectorAll(".toggle-modal");
    let modal = document.getElementById("modal");
    modalOpener.forEach((btn) => btn.addEventListener("click", toggleModal));
    function toggleModal() {
      modal.classList.toggle("hidden");
    }
    // Ecoute du bouton ECHAP pour fermer la modal
    document.addEventListener("keydown", (e) =>
      e.code == "Escape" ? modal.classList.add("hidden") : ""
    );
    function commandViewer(image) {
      // ENLEVER L'image du viewer si il y en a une
      while (viewer.firstChild) {
        viewer.removeChild(viewer.firstChild);
      }
      if (image.tagName == "IMG") {
        viewer.insertAdjacentHTML(
          "beforeend",
          `<img src=${image.src} id=${image.id} alt=${image.alt}>
          <p>${image.alt}</p>`
        );
      }
      if (image.tagName == "VIDEO") {
        viewer.insertAdjacentHTML(
          "beforeend",
          `<video src=${image.src} id="${image.id}"  controls="controls">
            <source id='mp4Source' src="movie.mp4" type="video/mp4" />
            <source id='oggSource' src="movie.ogg" type="video/ogg" />
            </video>
            <p>${image.title}</p>`
        );
      }
    }
    // Variables pour le Carousel d'image
    let viewer = document.getElementById("viewer");
    let closeViewer = document.getElementById("croixviewer");
    let images = document.querySelectorAll(".media");
    let precedent = document.getElementById("flechegauche");
    let suivant = document.getElementById("flechedroite");

    // ______ Ecoute du click sur les images ________
    images.forEach((image, index) => {
      // Affichage de la lightbox / Viewer
      image.addEventListener("click", function setViewer(e) {
        let lastIndex = images.length - 1;
        let lastMedia = images[lastIndex];
        let x = 0;
        container.classList.add("active");
        commandViewer(image);
        // PASSER A L'IMAGE PRECEDENTE
        precedent.addEventListener("click", function (e) {
          getPrevious();
        });
        function getPrevious() {
          // Si il y a une image avant
          x++;
          if (images[index - 1]) {
            commandViewer(images[index - 1]);
            index = index - 1;
          } else {
            // Sinon afficher la dernière photo
            commandViewer(lastMedia);
            index = lastIndex;
            x = 0;
          }
        }

        // PASSER A L'IMAGE SUIVANTE
        suivant.addEventListener("click", function (e) {
          getNext();
        });

        function getNext() {
          x++;
          // Si il y a une image après
          if (images[index + 1]) {
            commandViewer(images[index + 1]);
            index = index + 1;
          } else {
            // Sinon afficher la première photo
            commandViewer(images[0]);
            index = 0;
            x = 0;
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
      });
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
    let likesCount = document.querySelectorAll(".likesCount");
    let compteur = document.getElementById("compteur");
    likesCount.forEach((button) => {
      button.addEventListener("click", function () {
        if (button.classList.contains("loved")) {
          button.classList.remove("loved");
          likesTotal--;
          compteur.innerHTML = likesTotal;
        } else {
          button.classList.add("loved");
          likesTotal++;
          compteur.innerHTML = likesTotal;
        }
      });
    });
  });

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
function check() {
  let value = dropdown.value;
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
}

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
