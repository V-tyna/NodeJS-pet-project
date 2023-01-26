module.exports  = {
  getPageNotFound: (req, res, next) => {
    res.render('404', {
      isAuthenticated: req.session.isLoggedIn
    });
  }
};
