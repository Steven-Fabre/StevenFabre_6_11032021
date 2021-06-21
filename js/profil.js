let list = new List();
let likeList = new List();
let toggler = true;
let timesSelectClicked = 0;
let likesTotal = 0;
let index = 0;
let lastIndex;
let currentIndex;
const compteur = document.getElementById("compteur");

fetch("./js/data.json")
  .then((resp) => resp.json())
  .then(function (data) {
    let id = getUrlParameter("id");
    const precedent = document.getElementById("flechegauche");
    const suivant = document.getElementById("flechedroite");
    for (let item of data.photographers) {
      if (id == item.id) {
        let photographer = new Photographer(item);
        photographer.renderProfil();
      }
    }
    for (let item of data.media) {
      if (id == item.photographerId) {
        let media = new Media(item);
        list.sortBy("likes");
        list.add(media);
        list.display("media");
      }
    }

    list.listenMedia();
    list.totalLikes();
    listenModal();

    document.addEventListener("keydown", (e) => {
      if (e.code == "Escape") {
        container.classList.remove("active");
        modal.classList.add("hidden");
      }
      if (container.classList.contains("active")) {
        if (e.code == "ArrowLeft") getPrevious();
        if (e.code == "ArrowRight") getNext();
      }
      if (e.code == "Enter") e.target.click();
    });

    document.addEventListener("click", function (e) {
      if (e.target === precedent) getPrevious();
      if (e.target === suivant) getNext();
      if (e.target === document.getElementById("croixviewer"))
        container.classList.remove("active");
    });
  });

function getPrevious() {
  if (currentIndex == 0) {
    list.commandViewer(list.all[lastIndex]);
    currentIndex = lastIndex;
  } else {
    list.commandViewer(list.all[currentIndex - 1]);
    currentIndex = currentIndex - 1;
  }
}

function getNext() {
  if (currentIndex == lastIndex) {
    list.commandViewer(list.all[0]);
    currentIndex = 0;
  } else {
    list.commandViewer(list.all[currentIndex + 1]);
    currentIndex = currentIndex + 1;
  }
}

checkSelect = function () {
  dropdown = document.getElementById("trier-par");
  if (timesSelectClicked == 0) {
    timesSelectClicked += 1;
  } else if (timesSelectClicked == 1) {
    timesSelectClicked = 0;
    list.sortBy(`${dropdown.value}`);
    list.display("media");
    list.listenMedia();
    list.totalLikes();
  }
};

listenModal = function () {
  const modal = document.getElementById("modal");
  document
    .querySelector(".btn-modal")
    .addEventListener("click", () => modal.classList.toggle("hidden"));

  document
    .getElementById("croix")
    .addEventListener("click", () => modal.classList.add("hidden"));

  document.getElementById("reserve").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(`Prénom : ${document.getElementById("first").value}`);
    console.log(`Nom : ${document.getElementById("last").value}`);
    console.log(`Email : ${document.getElementById("email").value}`);
    console.log(`Message : ${document.getElementById("message").value}`);
    modal.classList.add("hidden");
  });
};
