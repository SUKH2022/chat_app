import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered:", userCredential.user);
        // Redirect or show a success message
        window.location.href = "index.html";
      })
      .catch((error) => console.error("Error:", error));
  });
});
