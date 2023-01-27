const { CSRF_CSRF_SECRET } = require('./keys.dev');

module.exports = {
  options: {
    getSecret: () => CSRF_CSRF_SECRET,
    cookieName: 'csrf',
    getTokenFromRequest: req => {
      if (req.body.csrfToken) { 
        return req.body.csrfToken;
      }
      return req['x-csrf-token'];
    }
  }
}