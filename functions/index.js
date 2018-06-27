const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-native-otp-practice.firebaseio.com"
});
