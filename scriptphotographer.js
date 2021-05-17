fetch("./data.json")
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
        if (currentMedia.image) {
          let img = document.createElement("img");
          img.src = `./img/${folderName}/${currentMedia.image}`;
          img.classList.add("media");
          let src = document.getElementById(currentMedia.id);
          src.appendChild(img);
        }
        if (currentMedia.video) {
          let img = document.createElement("video");
          img.setAttribute("src", `./img/${folderName}/${currentMedia.video}`);
          img.classList.add("media");
          let src = document.getElementById(currentMedia.id);
          src.appendChild(img);
        }
        console.log(currentMedia);
      }
    }
    // OPEN AND CLOSE CONTACT MODAL
    let modalOpener = document.querySelectorAll(".toggle-modal");
    let modal = document.getElementById("modal");
    modalOpener.forEach((btn) => btn.addEventListener("click", toggleModal));
    function toggleModal() {
      modal.classList.toggle("hidden");
    }
  });
