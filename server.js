const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUserByUsername
} = require("./utils/users");
const admin = require("firebase-admin");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Firebase Admin SDK initialization
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Login route
app.post("/login", (req, res) => {
  const idToken = req.body.idToken;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      // Here, you can create a session for the user
      res.status(200).json({ uid });
    })
    .catch((error) => {
      res.status(401).json({ error: "Unauthorized" });
    });
});

const botName = "ChatBot";

// Run when client connects
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Chat_App!"));

    // Broadcast when a user connects to the course
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room information
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen to the chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Listen for privateMessage
  socket.on("privateMessage", ({ recipient, msg }) => {
    const sender = getCurrentUser(socket.id);
    const recipientUser = getUserByUsername(recipient);

    if (recipientUser) {
      io.to(recipientUser.id).emit('privateMessage', formatMessage(sender.username, msg));
    }
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
