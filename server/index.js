const webSocketsServerPort = 3000;
const webSocketServer = require('websocket').server;
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
});

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};
// I'm maintaining all active rooms in this object
const rooms = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];



const sendMessage = (json) => {
  // We are sending the current data to all connected clients
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(json);
  });
}

const typesDef = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange",
  MULTI_START: "multistart",
  MULTI_CHANGE: "multichange",
  MULTI_COMPLETE: "multicomp"
}

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  //console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      const dataFromClient = JSON.parse(message.utf8Data);
      const json = { type: dataFromClient.type };

      if (dataFromClient.type === typesDef.USER_EVENT) {
        users[userID] = dataFromClient;
        console.log(`${dataFromClient.username} joined to edit the document in room ${dataFromClient.room}`)
        userActivity.push(`${dataFromClient.username} joined to edit the document in room ${dataFromClient.room}`);
        if (!rooms[dataFromClient.room]) {
          rooms[dataFromClient.room] = {connections: [userID]}
          json.data = {users: users, userActivity: userActivity, message: "newroom", data: dataFromClient};
        }
        else {
          rooms[dataFromClient.room]["connections"].push(userID)
          json.data = {users: users, userActivity: userActivity, message: "joinroom", data: dataFromClient};
        }
        console.log(users, rooms)
      }

      else if (dataFromClient.type === typesDef.MULTI_START) {
        json.data = {users: users, userActivity: userActivity, message: "multistart", questions: dataFromClient.questions};
      }

      else if (dataFromClient.type === typesDef.MULTI_CHANGE) {
        json.data = {users: users, userActivity: userActivity, message: "multichange", questions: dataFromClient.questions};
      }

      else if (dataFromClient.type === typesDef.MULTI_COMPLETE) {
        json.data = {users: users, userActivity: userActivity, message: "multicomp"};
      }
      
      else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
        editorContent = dataFromClient.content;
        json.data = { editorContent, userActivity };
      }

      sendMessage(JSON.stringify(json));
    }
  });

  // user disconnected
  connection.on('close', function(connection) {
    console.log((new Date()) + " Peer " + userID + " disconnected.");
    const json = { type: typesDef.USER_EVENT };
    json.data = {users: users, userActivity: userActivity, message: "userleave"};
    delete clients[userID];
    delete users[userID];
    sendMessage(JSON.stringify(json));
  });
});

app.use(express.static(path.join(__dirname, "..", "build")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});