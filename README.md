# 🚀 ChatOn App

Welcome to the **ChatOn App**! This application allows users to join chat rooms and communicate in real-time. Below you'll find step-by-step instructions to get started, as well as some useful VS Code extensions to enhance your development experience.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Key Code Snippets](#key-code-snippets)
- [Screenshots](#screenshots)
- [Useful VS Code Extensions](#useful-vs-code-extensions)
- [Contributing](#contributing)

## ✨ Features

- Real-time chat functionality
- Multiple chat rooms for course
- User join/leave notifications
- Responsive design

## 🛠️ Installation

Follow these steps to get the project up and running on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/chat-app.git
   cd chat-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

4. **Open your browser and navigate to:**

   ```
   http://localhost:3000
   ```

5. ## **Live Website Link:**

   ```
   https://chat-app-se2a.onrender.com/
   ```


## 🚀 Usage

Once the server is running, you can:

1. Open your browser and go to `http://localhost:3000`.
2. Enter a username and select a course.
3. Start chatting with other users in real-time!

## 📄 Key Code Snippets

Here are some key parts of the code to help you understand the main functionality of the app:

### Server Setup

```javascript
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatBot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Chat_App!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botName, `${user.username} has joined the chat`));

    // Send users and room information
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### User Management

```javascript
const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
```

### Message Formatting

```javascript
const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
```


## 🧩 Useful VS Code Extensions

To make your development process smoother, here are some recommended VS Code extensions:

1. **Prettier - Code formatter** - An opinionated code formatter to maintain consistent code style.
2. **Live Server** - Launch a local development server with live reload feature.
3. **Bracket Pair Colorizer** - Adds color to matching brackets for better readability.
4. **Debugger for Chrome** - Debug your JavaScript code running in the browser directly from VS Code.

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a Pull Request.

## Members Contribution

- Author: Sukhpreet Saini
- Vansh
- Astu
- Vishal
