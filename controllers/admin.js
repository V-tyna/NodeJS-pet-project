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
    const prods = await Product.fetchAll();
    res.render('admin/products-list', {
      pageTitle: 'Admin products-list page',
      activeAdminProducts: true,
      prods
    });
  },
  postAddProduct: async (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, imageUrl, price, description);
    await product.save();
    res.redirect('/');
  }
}