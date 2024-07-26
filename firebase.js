const admin = require('firebase-admin');
const serviceAccount = require('./chat-app-43091-firebase-adminsdk-uyvtj-8d2200cd1b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
