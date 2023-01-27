const { createToken } = require('../../utils/createToken');

const deepClone = require('../../utils/deepClone');
const Product = require('../../models/mongoose/product');

module.exports = {
	getAddProduct: (req, res, next) => {
		createToken(res);
		return res.render('admin/edit-product', {
			activeAddProd: true,
			isAuthenticated: req.session.isLoggedIn,
			pageTitle: 'Add product page',
			productCSS: true,
		});
	},
	getEditProduct: async (req, res, next) => {
		createToken(res);
		const editMode = req.query.edit;
		const productId = req.params.productId;
		if (!editMode) {
			return res.redirect('/');
		}
		try {
			const prod = await Product.findById(productId);
			const product = deepClone(prod);
			res.render('admin/edit-product', {
				isAuthenticated: req.session.isLoggedIn,
				editing: editMode,
				pageTitle: 'Edit product page',
				product,
				productCSS: true,
			});
		} catch (e) {
			console.log('Product not found.');
			return res.redirect('/');
		}
	},
	getProducts: async (req, res, next) => {
		try {
			createToken(res);
			const products = await Product.find({ userId: req.user._id });
			const prods = deepClone(products);
			return res.render('admin/products-list', {
				activeAdminProducts: true,
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Admin products-list page',
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

			const product = new Product({
				description,
				imageUrl,
				price,
				title,
				userId,
			});
			await product.save();
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Add product error:', e);
		}
	},
	postDeleteProduct: async (req, res, next) => {
		try {
			const { productId } = req.body;
			await Product.findOneAndDelete({
				_id: productId,
				userId: req.user._id,
			});
			await req.user.deleteProductFromTheCart(productId);
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Deleting product error: ', e);
		}
	},
	postEditProduct: async (req, res, next) => {
		try {
			const { title, imageUrl, price, description, productId } = req.body;
			await Product.findOneAndUpdate(
				{ _id: productId, userId: req.user._id },
				{
					description,
					imageUrl,
					price,
					title,
				}
			);
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Update product error: ', e);
		}
	},
};
