const Product = require('../models/product');

module.exports = {
  getAddProduct: (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add product page',
      activeAddProd: true,
      productCSS: true
    });
  },
  getProducts: async (req, res, next) => {
    res.render('admin/products-list', {
      pageTitle: 'Admin products-list page',
      activeAdminProducts: true
    });
  },
  postAddProduct: async (req, res, next) => {
    const product = new Product(req.body.title);
    await product.save();
    res.redirect('/');
  }
}