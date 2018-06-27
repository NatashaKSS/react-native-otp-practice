const admin = require('firebase-admin');
const functions = require('firebase-functions');

const createUser = require('./create_user');
const requestOTP = require('./request_one_time_password');
const serviceAccount = require('./service-account-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-native-otp-practice.firebaseio.com"
});

exports.createUser = functions.https.onRequest(createUser);
exports.requestOneTimePassword = functions.https.onRequest(requestOTP);
