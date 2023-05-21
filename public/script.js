let client = io();

let messages = document.getElementById("messages");
let form = document.getElementById("form");
let input = document.getElementById("input");

// prompt, vraagt de naam van user in een pop-up
let clientName = prompt("Wat is jouw naam?");
//user joined
let joined = document.createElement("li");
joined.textContent = "You joined"; //laat zien als de gebruiker deelneemt
messages.appendChild(joined);
client.emit("new-user", clientName); // laat een user connect messages zien

// Luister naar het submit event
form.addEventListener("submit", function (event) {
  event.preventDefault();
  // Als er überhaupt iets getypt (pakt messages van client-side)
  if (input.value) {
    client.emit("chat message", input.value);
    // Leeghalen van input field door 0 value mee te gegeven
    input.value = "";
  }
});

client.on("chat message", (message) => {
  let item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
