const admin = require('firebase-admin');
const twilio = require('./twilio');

/**
 * Generates a one-time-password code, sends that as an SMS to the user and
 * then saves it to our Firebase database so that it can be verified later
 * once the SMS has been successfully sent.
 *
 * Note:
 * Need a paid Twilio / Firebase account here to test these out.
 * The Twilio number used is also not verified -- needs a paid subscription.
 */

module.exports = function(req, res) {
  if (! req.body.phone) {
    return res.status(422).send({ error: 'You must provide a phone number' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  // Uses the user's phone number as the UID
  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor(Math.random() * 10000);

      twilio.messages.create({
        body: 'Your code is ' + code,
        to: phone,
        from: '+18564223061',
      }, (error) => {
        if (error) {
          return res.status(422).send(error);
        }

        admin.database().ref('users/' + phone)
          .update({ code, codeValid: true }, () => {
            res.send({ success: true });
          });

        return null;
      });

      return null;
    })
    .catch(error => {
      res.status(422).send({ error });
    });

    return null;
};
