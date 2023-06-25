let client = io();

let messages = document.getElementById("messages");
let form = document.getElementById("form");
let input = document.getElementById("input");

// prompt, vraagt de naam van user in een pop-up
let clientName = prompt("Wat is jouw naam?");
addMessage("Jij neemt deel aan de chat");
// stuurt het bericht naar de server
client.emit("new user", clientName);

// Luister naar het submit event
form.addEventListener("submit", function (event) {
  event.preventDefault();
  // Als er überhaupt iets getypt, luisterd naar de berichten van de client
  if (input.value) {
    //Stuur het bericht naar de server
    client.emit("chat message", input.value);
    // Leeghalen van input field, door 0 value mee te gegeven
    input.value = "";
  }
});

// Luister naar berichten van de server
client.on("message", (message) => {
  //Geeft de naam mee wanneer de gebruiker typt
  addMessage(`${message.clientName}: ${message.message}`);
});

// Luister naar berichten van de server voor te laten weten dat de user met een specifiek id deelneemt aan de chat
client.on("user connected", (clientName) => {
  addMessage(`${clientName}, connected`);
});

/**
 * Impure function that appends a new li item holding the passed message to the
 * global messages object and then scrolls the list to the last message.
 * @param {*} message the message to append
 */
function addMessage(message) {
  messages.appendChild(
    Object.assign(document.createElement("li"), { textContent: message })
  );
  messages.scrollTop = messages.scrollHeight;
}
