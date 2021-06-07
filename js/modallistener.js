"use strict";
const sendBtn = document.getElementById("send-modal");
const reserve = document.getElementById("reserve");

reserve.addEventListener("submit", function (e) {
  e.preventDefault();
  const prenom = document.getElementById("first");
  const nom = document.getElementById("last");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  console.log(prenom.value);
  console.log(nom.value);
  console.log(email.value);
  console.log(message.value);
});
