const Product = require('../../models/mongoDB/product');

const deepClone = require('../../utils/deepClone');

module.exports = {
	getAddProduct: (req, res, next) => {
		return res.render('admin/edit-product', {
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
			const prod = await Product.findProductById(productId);
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
			await Product.updateProduct(productId, {
				title,
				imageUrl,
				price,
				description,
			});
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Update product error: ', e);
		}
	},
	postDeleteProduct: async (req, res, next) => {
		try {
			const { productId } = req.body;
			await Product.deleteProduct(productId, req.user);
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Deleting product error: ', e);
		}
	},
	getProducts: async (req, res, next) => {
		try {
			const products = await Product.fetchAll();
			const prods = deepClone(products);
			return res.render('admin/products-list', {
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
			const { _id: userId } = req.user;
			const product = new Product(title, imageUrl, price, description, userId);
			await product.save();
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Add product error:', e);
		}
	},
};
