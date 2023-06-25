// Express initializes app to be a function handler that you can supply to an HTTP server (as seen in line 4).
// We define a route handler / that gets called when we hit our website home.
// We make the http server listen on port 3000.

import * as path from "path";
import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const ioServer = new Server(httpServer);
const port = process.env.PORT || 3000;

// all clients
const users = {};

// Serveer client-side bestanden (je kan ook het HTML-bestand ophalen met een get)
app.use(express.static(path.resolve("public")));

// Start de socket.io server op
ioServer.on("connection", (client) => {
  // geef de naam mee van de gebruik die ingevoerd is in  de pop-up
  client.on("new user", (clientName) => {
    // geeft de gebruikers naam mee aan het specifiek id
    users[client.id] = clientName;
    client.emit("user connected", clientName);
  });
  // Log de connectie naar console
  console.log(`user ${client.id} connected`);

  // Luister naar een message van een gebruiker
  client.on("chat message", (message) => {
    client.emit("chat-message", {
      message: message,
      clientName: users[client.id],
    });
    // Log het ontvangen bericht
    console.log(`user ${client.id} sent message: ${message}`);

    // Verstuur het bericht naar alle clients
    ioServer.emit("message", message);
  });
});

// Luister naar een disconnect van een gebruiker
ioServer.on("disconnect", () => {
  client.emit("user-disconnected", users[client.id]);
  delete users[client.id];
  // Log de disconnect
  console.log(`user ${client.id} disconnected`);
});

// Start een http server op het ingestelde poortnummer en log de url
httpServer.listen(port, () => {
  console.log("listening on http://localhost:3000");
});
