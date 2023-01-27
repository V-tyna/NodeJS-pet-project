const { EMAIL_FROM } = require('./keys.dev');

module.exports = {
  createMessage: (email, subject, text, name, mainMessage) => {
    return {
      to: email, 
      from: EMAIL_FROM,
      subject,
      text,
      html: `<h4>Hello, ${name}!</h4>
      <strong>${mainMessage}</strong>
      <p>Thanks for choosing us!</p>
      <hr />`,
    }
  }
};
