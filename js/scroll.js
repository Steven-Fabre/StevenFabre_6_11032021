"use strict";
let lastScrollTop = 0;
let returnButton = document.getElementById("return");
window.addEventListener(
  "scroll",
  function () {
    let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > lastScrollTop) {
      returnButton.classList.remove("hidden");
    } else {
      returnButton.classList.add("hidden");
    }
    lastScrollTop = st <= 0 ? 0 : st;
  },
  false
);

returnButton.addEventListener("click", function () {
  window.pageYOffset = 0;
  document.documentElement.scrollTop = 0;
});
