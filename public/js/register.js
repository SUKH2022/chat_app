import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('User registered:', user);
      window.location.href = 'index.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error:', errorCode, errorMessage);
    });
});
