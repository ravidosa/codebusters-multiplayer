const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const path = require('path');
const server = express()
.use(express.static(path.join(__dirname, "..", "build")))
.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
})
.listen(PORT, () => {
  console.log("server started on port 5000");
});
const wss = new Server({ server });

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// I'm maintaining all active rooms in this object
const rooms = {};
// User activity history.
let userActivity = [];

const typesDef = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange",
  MULTI_START: "multistart",
  MULTI_CHANGE: "multichange",
  MULTI_COMPLETE: "multicomp",
  LOADING: "loading"
}


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const dataFromClient = JSON.parse(message);
    const json = { type: dataFromClient.type};

    if (dataFromClient.type === typesDef.USER_EVENT) {
      ws.username = dataFromClient.username
      ws.room = dataFromClient.room
      console.log(`${dataFromClient.username} joined room ${dataFromClient.room}`)
      userActivity.push(`${dataFromClient.username} joined room ${dataFromClient.room}`);
      if (!rooms[dataFromClient.room]) {
        rooms[dataFromClient.room] = {connections: [userID]}
        json.data = {users: Array.from(wss.clients).map(a => {return {userID: a.userID, room: a.room, username: a.username}}), message: "newroom", data: dataFromClient};
      }
      else {
        rooms[dataFromClient.room]["connections"].push(userID)
        json.data = {users: Array.from(wss.clients).map(a => {return {userID: a.userID, room: a.room, username: a.username}}), message: "joinroom", data: dataFromClient};
      }
    }

    else if (dataFromClient.type === typesDef.MULTI_START) {
      json.data = {users: Array.from(wss.clients).map(a => {return {userID: a.userID, room: a.room, username: a.username}}), message: "multistart", questions: dataFromClient.questions};
    }

    else if (dataFromClient.type === typesDef.MULTI_CHANGE) {
      json.data = {users: Array.from(wss.clients).map(a => {return {userID: a.userID, room: a.room, username: a.username}}), message: "multichange", questions: dataFromClient.questions};
    }

    else if (dataFromClient.type === typesDef.MULTI_COMPLETE) {
      json.data = {users: Array.from(wss.clients).map(a => {return {userID: a.userID, room: a.room, username: a.username}}), message: "multicomp"};
    }

    else if (dataFromClient.type === typesDef.LOADING) {
      json.data = {message: "loading"};
    }
    wss.clients.forEach(function each(client) {
      console.log(json)
      client.send(JSON.stringify(json));
    });
  });

  var userID = getUniqueID();
  ws.userID = userID
  console.log('connected: ' + userID + ' in ' + (Array.from(wss.clients).map(a => a.userID)).join(", "));
});
