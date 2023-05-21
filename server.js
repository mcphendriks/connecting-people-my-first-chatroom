// Express initializes app to be a function handler that you can supply to an HTTP server (as seen in line 4).
// We define a route handler / that gets called when we hit our website home.
// We make the http server listen on port 3000.

import * as path from "path";
import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const ioServer = new Server(server);

// all clients
const clients = {};
// Serveer client-side bestanden (je kan ook het HTML-bestand ophalen met een get)
app.use(express.static(path.resolve("public")));

// Start de socket.io server op
ioServer.on("connection", (client) => {
  client.on("new-user", (clientName) => {
    clients[client.id] = clientName;
    ioServer.emit("user-connected", clientName); // laat elke client een unieke naam meegeven
  }); // start
  // Log de connectie naar console
  console.log("a user connected");
  client.on("disconnect", () => {
    // Luister naar een disconnect van een gebruiker
    console.log("user disconnected");
  }); /*console.log(`user ${client.id} connected`)*/
});

// Verstuur de chat message naar alle clients
ioServer.on("connection", (client) => {
  client.on("chat message", (messages) => {
    console.log("message: " + messages);
    // Broadcasting van message naar alle clients
    // send the event from the server to the rest of the users.
    ioServer.emit("chat message", messages);
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
