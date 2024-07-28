// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAnITq87eQSIoBXmTr8hBnzttsuyssSws",
  authDomain: "chat-app-43091.firebaseapp.com",
  projectId: "chat-app-43091",
  storageBucket: "chat-app-43091.appspot.com",
  messagingSenderId: "1027178703055",
  appId: "1:1027178703055:web:2252016be98d0f49efafba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const logOutButton = document.getElementById('logout-btn');
const userId = document.getElementById('userId-display');
const userSelect = document.getElementById('user-select');

// set userID
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId.innerText = user.email;
  } else {
    window.location = '../index.html';
  }
});

// Log Out Button
logOutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location = '../index.html'; // Redirect to login page after sign out
  });
});

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// private messages
socket.on('privateMessage', (message) => {
  console.log(`Private message from ${message.username}: ${message.text}`);
  outputPrivateMessage(message);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  const recipient = userSelect.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  if (recipient) {
    // Emit private message to server
    socket.emit('privateMessage', { recipient, msg });
  } else {
    // Emit public message to server
    socket.emit('chatMessage', msg);
  }

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Output private message to DOM
function outputPrivateMessage(message) {
  const div = document.createElement('div');
  div.classList.add('private-message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = `Private from ${message.username}`;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM and user select dropdown
function outputUsers(users) {
  userList.innerHTML = '';
  userSelect.innerHTML = '<option value="">Select User</option>';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
    const option = document.createElement('option');
    option.value = user.username;
    option.innerText = user.username;
    userSelect.appendChild(option);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
