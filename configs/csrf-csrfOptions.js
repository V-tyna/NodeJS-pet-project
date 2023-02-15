const keys = require('./keys');

module.exports = {
  options: {
    getSecret: () => keys.CSRF_CSRF_SECRET,
    cookieName: 'csrf',
    getTokenFromRequest: req => {
      if (req.body.csrfToken) { 
        return req.body.csrfToken;
      }
      return req['x-csrf-token'];
    }
  }
}