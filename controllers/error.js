module.exports  = {
  getPageNotFound: (req, res, next) => {
    return res.status(404).render('404', {
      title: 'Page 404',
      isAuthenticated: req.session.isLoggedIn
    });
  },
  get500Page: (req, res, next) => {
    return res.status(500).render('500', {
      title: 'Error page 500',
      isAuthenticated: req.session.isLoggedIn
    });
  }
};
