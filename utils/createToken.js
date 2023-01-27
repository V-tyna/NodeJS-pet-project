const { doubleCsrf } = require("csrf-csrf");
const { options } = require('../configs/csrf-csrfOptions');

const { generateToken } = doubleCsrf(options);

module.exports = {
  createToken: (res) => {
    res.locals.csrf = generateToken(res);
  }
};
