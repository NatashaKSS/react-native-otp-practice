const admin = require('firebase-admin');

module.exports = function(req, res) {
  // Verify the user provided a phone number
  if (!req.body.phone) {
    return res.status(422).send({ error: 'Bad phone number input' });
  }

  // Format the phone number to remove non-digit symbols
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  // Create a new user account using this phone number
  admin.auth().createUser({ uid: phone })
    .then(user => res.send(user))
    .catch(error => res.status(422).send({ error }));
}
