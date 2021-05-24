"use strict";

// POUR LE SCROLL

let lastScrollTop = 0;
let returnButton = document.getElementById("return");
let mediaCard = document.getElementsByClassName("mediaCard");
window.addEventListener(
  "scroll",
  function () {
    let scrolling = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolling || 0) {
      returnButton.classList.remove("hidden");
    } else {
      returnButton.classList.add("hidden");
    }
  },
  false
);

// Bouton de reset

returnButton.addEventListener("click", function () {
  window.pageYOffset = 0;
  document.documentElement.scrollTop = 0;
  check();
  returnButton.classList.add("hidden");
});
