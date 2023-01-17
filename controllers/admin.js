const Product = require('../models/product');

module.exports = {
  getAddProduct: (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add product page',
      activeAddProd: true,
      productCSS: true
    });
  },
  getEditProduct: async (req, res, next) => {
    const editMode = req.query.edit;
    const productId = req.params.productId;
    console.log('Query params: ', editMode);
    if (!editMode) {
      return res.redirect('/');
    }
    try {
      const product = await Product.findProductById(productId);
      console.log('Product to edit: ', product);
      res.render('admin/edit-product', {
        pageTitle: 'Edit product page',
        productCSS: true,
        editing: editMode,
        product
      });
    } catch(e) {
      console.log('Product not found.');
      return res.redirect('/');
    }
  },
  postEditProduct: async (req, res, next) => { 
    const { title, imageUrl, price, description, productId } = req.body;
    const updatedProduct = new Product(title, imageUrl, price, description, productId);
    updatedProduct.save();
    res.redirect('/admin/products-list');
  },
  postDeleteProduct: async (req, res, next) => {
    const { productId, price } = req.body;
    await Product.deleteById(productId, price);
    console.log('Deletion request ', productId);
    res.redirect('/admin/products-list');
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
    const product = new Product(title, imageUrl, price, description, null);
    await product.save();
    res.redirect('/');
  }
}