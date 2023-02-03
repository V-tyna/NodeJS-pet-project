const { createToken } = require('../../utils/createToken');
const { validationResult } = require('express-validator');

const deepClone = require('../../utils/deepClone');
const getError = require('../../utils/getError');
const Product = require('../../models/mongoose/product');

module.exports = {
	getAddProduct: (req, res, next) => {
		try {
			const data = req.flash('userData');
			createToken(res);
			return res.render('admin/edit-product', {
				activeAddProd: true,
				errorValidation: req.flash('errorValidation'),
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Add product page',
				product: data[0],
				productCSS: true,
				validationErrors: req.flash('validationErrors'),
			});
		} catch (e) {
			getError('Rendering Add product page error', e);
		}
	},
	getEditProduct: async (req, res, next) => {
		createToken(res);
		const editMode = req.query.edit;
		const productId = req.params.productId;
		if (!editMode) {
			return res.redirect('/');
		}
		try {
			const errorValidation = req.flash('errorValidation');
			let product;
			if (errorValidation.length) {
				product = req.flash('userData')[0];
			} else {
				const prod = await Product.findById(productId);
				product = deepClone(prod);
			}
			res.render('admin/edit-product', {
				editing: editMode,
				errorValidation,
				isAuthenticated: req.session.isLoggedIn,
				pageTitle: 'Edit product page',
				product,
				productCSS: true,
				validationErrors: req.flash('validationErrors'),
			});
		} catch (e) {
			getError('Product page error. Possibly that product not found.', e);
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
		} catch (e) {
			getError('Get products in Admin page error: ', e);
		}
	},
	postAddProduct: async (req, res, next) => {
		try {
			const { title, imageUrl, price, description } = req.body;
			const { _id: userId } = req.user;

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				req.flash('validationErrors', errors.array());
				req.flash('userData', { title, imageUrl, price, description });
				req.flash('errorValidation', errors.array()[0].msg);
				return res.status(422).redirect('/admin/add-product');
			}
			const product = new Product({
				description,
				imageUrl,
				price,
				title,
				userId,
			});
			await product.save();
			return res.status(201).redirect('/admin/products-list');
		} catch (e) {
			getError('Add product POST error: ', e);
		}
	},
	deleteProduct: async (req, res, next) => {
		try {
			const { productId } = req.params;
			await Product.findOneAndDelete({
				_id: productId,
				userId: req.user._id,
			});
			await req.user.deleteProductFromTheCart(productId);
			return res.status(200).json({ message: 'Success!' });
		} catch (e) {
			res.status(500).json({ message: 'Deleting product failed.' });
		}
	},
	postEditProduct: async (req, res, next) => {
		try {
			const { title, imageUrl, price, description, productId } = req.body;

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				req.flash('validationErrors', errors.array());
				req.flash('userData', { title, imageUrl, price, description });
				req.flash('errorValidation', errors.array()[0].msg);
				return res
					.status(422)
					.redirect(`/admin/edit-product/${productId}?edit=true`);
			}
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
			getError('Update product error: ', e);
		}
	},
};
