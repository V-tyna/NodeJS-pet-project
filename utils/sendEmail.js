const sgMail = require('@sendgrid/mail');

const { createMessage } = require('../configs/sendGridMessage');
const { SENDGRID_API_KEY } = require('../configs/keys.dev');

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = {
  sendSignupEmail: async (email, userName) => {
    try {
      const msg = createMessage(
        email,
        'Account created!',
        'Your account was successfully created',
        userName,
        'Your account on Node pet project platform was successfully created.'
      );
      await sgMail.send(msg);
      console.log('Email was sent.');
    } catch (e) {
      console.log('Sending email from SendGrid error: ', e);
    }
  },
  sendResetPasswordEmail: async (email, userName, token) => {
    try {
      const msg = createMessage(
        email,
        'Password reset',
        'This is link for resetting your password.',
        userName,
        `<h4>Please follow the link to reset your password: </h4>
        <a href='http://localhost:3000/reset/${token}'>reset password</a>`
      );
      await sgMail.send(msg);
      console.log('Email was sent.');
    } catch (e) {
      console.log('Sending email from SendGrid error: ', e);
    }
  }
}