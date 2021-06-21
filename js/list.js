class List {
  constructor() {
    this.all = [];
    this.tags = new Set();
    this.name;
  }

  add(item) {
    this.all.push(item);
  }

  display(item) {
    const compteur = document.getElementById("compteur");
    let html = ``;
    let destination = document.getElementById(item);

    for (item of this.all) {
      html += item.render();
    }
    destination.innerHTML = html;
    if (compteur) {
      for (item of this.all) {
        if (compteur.classList.contains(`${item.id}`))
          document.getElementById(`${item.id}`).classList.add("loved");
      }
    }
  }

  totalLikes() {
    likesTotal = this.all.reduce(function (accumulator, item) {
      return accumulator + item.likes;
    }, 0);
    document.getElementById("compteur").innerHTML = likesTotal;
  }

  listenMedia = () => {
    document.querySelectorAll(".mediaCard").forEach((media, index) => {
      media.addEventListener("click", (el) => {
        currentIndex = index;
        if (el.target.closest(".likesCount")) {
          let likeCount = el.target
            .closest(".likesCount")
            .querySelector(".numberLike");
          this.likeFunc(this.all, media, likeCount);
        }
        if (el.target.tagName == "IMG" || el.target.tagName == "VIDEO") {
          this.commandViewer(this.all[index]);
        }
      });
    });
  };

  commandViewer(media) {
    // ENLEVER L'image du viewer si il y en a une
    lastIndex = this.all.length - 1;
    let viewer = document.getElementById("viewer");
    while (viewer.firstChild) {
      viewer.removeChild(viewer.firstChild);
    }
    container.classList.add("active");
    if (media.image) {
      viewer.insertAdjacentHTML(
        "beforeend",
        `<img src="./img/${getUrlParameter("name")}/${media.image}" id=${
          media.id
        } alt=${media.title}>
        <p>${media.title}</p>`
      );
    }
    if (media.video) {
      viewer.insertAdjacentHTML(
        "beforeend",
        `<video src="./img/${getUrlParameter("name")}/${media.video}" id="${
          media.id
        }"  controls="controls">
        <p>Votre navigateur ne supporte pas la lecture du média, voici à la place un <a href="./img/${getUrlParameter(
          "name"
        )}/${media.video}">lien de la vidéo</a> à télécharger</p>
          <source id='mp4Source' src="movie.mp4" type="video/mp4" />
          <source id='oggSource' src="movie.ogg" type="video/ogg" />
          </video>
          <p>${media.title}</p>`
      );
    }
  }

  likeFunc(allMedias, media, likeCount) {
    let currentMedia = allMedias.find((object) => object.id == media.id);
    const compteur = document.getElementById("compteur");
    if (media.classList.contains("loved")) {
      compteur.classList.remove(media.id);
      media.classList.remove("loved");
      likesTotal--;
      compteur.innerHTML = likesTotal;
      currentMedia.likes--;
      likeCount.innerHTML = currentMedia.likes;
    } else {
      compteur.classList.add(media.id);
      media.classList.add("loved");
      likesTotal++;
      compteur.innerHTML = likesTotal;
      currentMedia.likes++;
      likeCount.innerHTML = currentMedia.likes;
    }
  }

  displayTags() {
    for (let photographe of this.all) {
      let html = ``;
      for (let tag of photographe.tags) {
        let balise = `<a data-value="${tag}" class="filters" aria-label="Accéder aux photos ${tag}"  title="${tag}">#${tag}</a>`;
        this.tags.add(balise);
        html += balise;
      }
      document.getElementById(`tag${photographe.id}`).innerHTML = html;
    }
    document.getElementById("categories").innerHTML = `${[...this.tags].join(
      " "
    )}`;
  }

  addFilter(filter) {
    let buttons = document.querySelectorAll(`[data-value = ${filter}]`);
    buttons.forEach((btn) => btn.classList.toggle("filters-active"));
    if (filtersArray.includes(filter))
      filtersArray = filtersArray.filter((el) => el != filter);
    else filtersArray.push(filter);
  }

  ApplyFilter() {
    const allPhotographers = document.querySelectorAll(".photographerCard");
    if (filtersArray.length === 0) {
      document.getElementById("return").classList.add("hidden");
      allPhotographers.forEach((photographe) =>
        photographe.classList.remove("hidden")
      );
    } else {
      document.getElementById("return").classList.remove("hidden");
      allPhotographers.forEach((photographe) =>
        photographe.classList.add("hidden")
      );
    }
  }

  showPhotographes() {
    const allPhotographers = document.querySelectorAll(".photographerCard");
    for (let person of allPhotographers) {
      for (let filter of filtersArray) {
        if (person.classList.contains(filter)) {
          person.classList.remove("hidden");
        }
      }
    }
  }

  sortBy = function (param) {
    this.all.sort(function (a, b) {
      let mod = toggler ? 1 : -1;
      let key = param;
      if (a[key] > b[key]) return 1 * mod;
      if (a[key] < b[key]) return -1 * mod;
      return 0;
    });
    toggler = !toggler;
    document.getElementById("arrow").style.transform = `rotate(${
      toggler ? "180deg" : "0deg"
    })`;
  };
}
