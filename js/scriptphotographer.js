"use strict";
fetch("./js/data.json")
  .then((resp) => resp.json())
  .then(function (data) {
    let idPage = window.location.hash.substring(1);
    let photographersArray = data.photographers;
    let mediaArray = data.media;
    let currentPhotographer;
    let currentMedia;
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
      tagBtn.setAttribute(
        "href",
        `index.html#${currentPhotographer.tags[tag]}`
      );
      tagBtn.setAttribute("class", `filters`);
      tagBtn.innerHTML = `#${currentPhotographer.tags[tag]}`;
    }
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

    for (let i in mediaArray) {
      if (mediaArray[i].photographerId == idPage) {
        currentMedia = mediaArray[i];
        createHTML("div", `${currentMedia.id}`, "photo");
        let photoDiv = document.getElementById(`${currentMedia.id}`);
        photoDiv.setAttribute("class", "mediaCard");
        if (currentMedia.image) {
          let src = document.getElementById(currentMedia.id);
          let img = document.createElement("img");
          img.classList.add("media");
          img.src = `./img/${folderName}/${currentMedia.image}`;
          src.appendChild(img);
        }
        if (currentMedia.video) {
          let img = document.createElement("video");
          img.setAttribute("src", `./img/${folderName}/${currentMedia.video}`);
          img.classList.add("media");
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

        // console.log(currentMedia);
      }
    }
    // OPEN AND CLOSE CONTACT MODAL
    let modalOpener = document.querySelectorAll(".toggle-modal");
    let modal = document.getElementById("modal");
    modalOpener.forEach((btn) => btn.addEventListener("click", toggleModal));
    function toggleModal() {
      modal.classList.toggle("hidden");
    }

    // Carousel d'image
    let viewer = document.getElementById("viewer");
    let closeViewer = document.getElementById("croixviewer");
    let container = document.getElementById("container");
    let images = document.querySelectorAll(".media");
    images.forEach((image) => {
      image.addEventListener("click", (e) => {
        container.classList.add("active");
        let img = document.createElement("img");
        img.src = image.src;
        // ENLEVER L'image du viewer si il y en a une
        while (viewer.firstChild) {
          viewer.removeChild(viewer.firstChild);
        }
        if (image.tagName == "IMG") {
          viewer.appendChild(img);
        }
        if (image.tagName == "VIDEO") {
          viewer.insertAdjacentHTML(
            "beforeend",
            `<video src=${image.src} id='videoPlayer' controls="controls">
            <source id='mp4Source' src="movie.mp4" type="video/mp4" />
            <source id='oggSource' src="movie.ogg" type="video/ogg" />
         </video>`
          );
        }
      });
    });
    closeViewer.addEventListener("click", (e) => {
      // Fermer le viewer

      container.classList.remove("active");
    });
  });
