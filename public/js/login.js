import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAnITq87eQSIoBXmTr8hBnzttsuyssSws",
  authDomain: "chat-app-43091.firebaseapp.com",
  projectId: "chat-app-43091",
  storageBucket: "chat-app-43091.appspot.com",
  messagingSenderId: "1027178703055",
  appId: "1:1027178703055:web:2252016be98d0f49efafba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      return result.user.getIdToken();
    })
    .then((token) => {
      return fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken: token })
      });
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.href = 'room.html';
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user.getIdToken();
    })
    .then((token) => {
      return fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken: token })
      });
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.href = 'room.html';
    })
    .catch(error => console.error('Error:', error));
});

window.loginWithGoogle = loginWithGoogle;
