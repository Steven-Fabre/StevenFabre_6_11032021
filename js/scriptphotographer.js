"use strict";
fetch("./js/data.json")
  .then((resp) => resp.json())
  .then(function (data) {
    // ___________ Declaration des variables __________
    let idPage = window.location.hash.substring(1);
    let photographersArray = data.photographers;
    let mediaArray = data.media;
    let currentPhotographer;
    let currentMedia;
    let currentMediaList = [];
    let photoArticle = document.getElementById("photo");

    // Compteur de likes
    let likesTotal = 0;

    for (let i in photographersArray) {
      if (photographersArray[i].id == idPage) {
        currentPhotographer = photographersArray[i];
      }
    }
    //Fonction générique de création de contenu à partir des objets JSON
    function insertElement(elementType, innerContent, parentDiv) {
      let el = document.createElement(elementType);
      el.innerHTML = innerContent;
      document.getElementById(parentDiv).appendChild(el);
    }
    // Fonction générique de création de carte à partir des objets JSON
    function createHTML(elementType, innerAttContent, parentDiv) {
      let element = document.createElement(elementType);
      element.setAttribute("id", innerAttContent);
      document.getElementById(parentDiv).appendChild(element);
    }
    createHTML("div", `description`, "profil");
    createHTML("div", `contact`, "description");
    insertElement("h1", `${currentPhotographer.name}`, "contact");
    createHTML("button", "btn-modal", "contact");
    let btnModal = document.getElementById("btn-modal");
    btnModal.classList.add("btn-modal");
    btnModal.classList.add("toggle-modal");
    btnModal.innerHTML = "Contactez-moi";
    insertElement(
      "h3",
      `${currentPhotographer.city},${currentPhotographer.country}`,
      "description"
    );
    insertElement("h4", `${currentPhotographer.tagline}`, "description");
    // Création des tags
    createHTML("div", `tags`, "description");
    for (let tag in currentPhotographer.tags) {
      let tagBtn = document.createElement("a");
      document.getElementById("tags").appendChild(tagBtn);
      tagBtn.setAttribute(`value`, `${currentPhotographer.tags[tag]}`);
      tagBtn.setAttribute("href", `#${currentPhotographer.tags[tag]}`);
      tagBtn.setAttribute("class", `filters`);
      tagBtn.innerHTML = `#${currentPhotographer.tags[tag]}`;
    }

    // Ajout de la photo de profil
    document
      .getElementById("description")
      .insertAdjacentHTML(
        "afterend",
        `<img class="profilpic" src="./img/IDPhotos/${currentPhotographer.portrait}">`
      );

    let modalName = document.querySelector(".modalname");
    modalName.textContent = `${currentPhotographer.name}`;

    // _______________ Afficher les photos __________

    function getFirstWord(str) {
      let spaceIndex = str.indexOf(" ");
      return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
    }

    let folderName = getFirstWord(`${currentPhotographer.name}`);
    // Creer le media suivant si c'est une photo ou une video
    for (let i in mediaArray) {
      if (mediaArray[i].photographerId == idPage) {
        currentMedia = mediaArray[i];
        createHTML("div", `${currentMedia.id}`, "photo");
        let photoDiv = document.getElementById(`${currentMedia.id}`);
        photoDiv.setAttribute("class", "mediaCard");
        photoDiv.classList.add(`${currentMedia.tags}`);
        if (currentMedia.image) {
          let src = document.getElementById(currentMedia.id);
          let img = document.createElement("img");
          img.classList.add("media");
          img.setAttribute("id", `${currentMedia.id}`);
          img.setAttribute("alt", `${currentMedia.title}`);
          img.src = `./img/${folderName}/${currentMedia.image}`;
          src.appendChild(img);
        }
        if (currentMedia.video) {
          let img = document.createElement("video");
          img.setAttribute("src", `./img/${folderName}/${currentMedia.video}`);
          img.classList.add("media");
          img.setAttribute("id", `${currentMedia.id}`);
          img.setAttribute("title", `${currentMedia.title}`);
          let src = document.getElementById(currentMedia.id);
          src.appendChild(img);
        }
        // DESCRIPTION DE LA PHOTO
        createHTML(
          "div",
          `photodescription${currentMedia.id}`,
          `${currentMedia.id}`
        );
        let photoDescription = document.getElementById(
          `photodescription${currentMedia.id}`
        );
        photoDescription.setAttribute("class", "photoDescription");

        insertElement(
          "p",
          `${currentMedia.title}`,
          `photodescription${currentMedia.id}`
        );
        // Creation des likes
        createHTML(
          "div",
          `like${currentMedia.id}`,
          `photodescription${currentMedia.id}`
        );
        insertElement("p", `${currentMedia.likes}`, `like${currentMedia.id}`);
        let likes = document.getElementById(`like${currentMedia.id}`);
        likes.setAttribute("class", "likesCount");
        likes.insertAdjacentHTML(
          "beforeend",
          `<i class="fas fa-heart" aria-label="likes"></i>`
        );

        // Créer le total des likes en rajoutant à chaque itération

        likesTotal += currentMedia.likes;
      }
    }
    // OPEN AND CLOSE CONTACT MODAL
    let modalOpener = document.querySelectorAll(".toggle-modal");
    let modal = document.getElementById("modal");
    modalOpener.forEach((btn) => btn.addEventListener("click", toggleModal));
    function toggleModal() {
      modal.classList.toggle("hidden");
    }

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
          `<video src=${image.src} id=${image.id}  controls="controls">
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
    let container = document.getElementById("container");
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
        document.addEventListener("keydown", (e) => {
          if (e.code == "Escape")
            container.classList.remove("active"), modal.classList.add("hidden");
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
