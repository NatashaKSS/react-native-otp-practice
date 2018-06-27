const admin = require('firebase-admin');

module.exports = function(req, res) {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: 'Phone no. and code must be provided' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  const code = parseInt(req.body.code);

  // Ensures we have a user with this phone UID in our database
  admin.auth().getUser(phone)
    .then(() => {
      const ref = admin.database().ref('users/' + phone);

      ref.on('value', (snapshot) => {
        ref.off(); // stop listening as soon as we heard 1 value change
        const user = snapshot.val();

        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'Code not valid' });
        }

        return null;
      });

      ref.update({ codeValid: false }); // used code already

      // generates a JWT for this user
      admin.auth().createCustomToken(phone)
        .then(token => res.send({ token }))
        .catch(error => res.status(500).send({ error }));

      return null;
    })
    .catch((error) => {
      return res.status(422).send({ error });
    });

  return null;
};
