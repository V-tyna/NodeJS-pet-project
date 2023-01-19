const Product = require('../models/productSequelize'); // Sequelize

const deepClone = require('../utils/deepClone');

module.exports = {
	getAddProduct: (req, res, next) => {
		res.render('admin/edit-product', {
			pageTitle: 'Add product page',
			activeAddProd: true,
			productCSS: true,
		});
	},
	getEditProduct: async (req, res, next) => {
		const editMode = req.query.edit;
		const productId = req.params.productId;
		if (!editMode) {
			return res.redirect('/');
		}
		try {
			const prod = await Product.findByPk(productId);
			const product = deepClone(prod);
			res.render('admin/edit-product', {
				pageTitle: 'Edit product page',
				productCSS: true,
				editing: editMode,
				product,
			});
		} catch (e) {
			console.log('Product not found.');
			return res.redirect('/');
		}
	},
	postEditProduct: async (req, res, next) => {
		try {
			const { title, imageUrl, price, description, productId } = req.body;
			await Product.update(
				{
					title,
					imageUrl,
					price,
					description,
				},
				{
					where: {
						id: productId,
					},
				}
			);
			res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Update product error: ', e);
		}
	},
	postDeleteProduct: async (req, res, next) => {
    try {
      const { productId, price } = req.body;
      await Product.destroy({
        where: {
          id: productId
        }
      });
      res.redirect('/admin/products-list');
    } catch(e) {
      console.log('Deleting product error: ', e);
    }
	},
	getProducts: async (req, res, next) => {
		try {
			const products = await Product.findAll();
			const prods = deepClone(products);
			res.render('admin/products-list', {
				pageTitle: 'Admin products-list page',
				activeAdminProducts: true,
				prods,
			});
		} catch {
			console.log('Get products in Admin page error: ', e);
		}
	},
	postAddProduct: async (req, res, next) => {
		try {
			const { title, imageUrl, price, description } = req.body;
			await Product.create({ title, imageUrl, price, description });
			res.redirect('/');
		} catch (e) {
			console.log('Add product error:', e);
		}
	},
};
