const Product = require('../../models/mongoose/product');

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
			const prod = await Product.findById(productId);
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
			await Product.findByIdAndUpdate(productId, {
				description,
				imageUrl,
				price,
				title,
			});
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Update product error: ', e);
		}
	},
	postDeleteProduct: async (req, res, next) => {
		try {
			const { productId } = req.body;
			await Product.findByIdAndDelete(productId);
			await req.user.deleteProductFromTheCart(productId);
			return res.redirect('/admin/products-list');
		} catch (e) {
			console.log('Deleting product error: ', e);
		}
	},
	getProducts: async (req, res, next) => {
		try {
			const products = await Product.find({ userId: req.user._id });
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
};
