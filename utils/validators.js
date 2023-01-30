const bcrypt = require('bcryptjs');
const { body } = require('express-validator');

const User = require('../models/mongoose/user');

module.exports = {
	cartValidators: [
		body('address', 'Field "Address" should not be empty.').trim().not().isEmpty(),
	],
	loginValidators: [
		body('email', "Email isn't valid.")
			.trim()
			.isEmail()
			.custom(async (value, { req }) => {
				try {
					const user = await User.findOne({ email: value });
					if (!user) {
						return Promise.reject(
							`User with email ${value} doesn\'t exist.`
						);
					}
					return true;
				} catch (e) {
					console.log('Checking login user existence error: ', e);
				}
			}),
		body(
			'password',
			'Password should consists of numbers and text and be at least 6 characters.'
		)
		  .trim()
			.isLength({ min: 6 })
			.isAlphanumeric()
			.custom(async (value, { req }) => {
				try {
					const user = await User.findOne({ email: req.body.email });
					if (user) {
						const doMatch = await bcrypt.compare(value, user.password);
						if (!doMatch) {
							return Promise.reject('Wrong password.');
						} else {
							req.session.user = user;
							req.session.isLoggedIn = true;
							return true;
						}
					}
				} catch (e) {
					console.log('Checking login user existence error: ', e);
				}
			}),
	],
	productValidators: [
		body('title', 'Field "Title" should not be empty.').trim().not().isEmpty(),
		body('imageUrl', 'Field "imageUrl" should not be empty.').trim().not().isEmpty(),
		body('price', 'Field "Price" should be a number.').trim().isFloat(),
		body('description', 'Field "description" should not be empty.').trim().not().isEmpty(),
	],
	signupValidators: [
		body('email', "Email isn't valid.")
			.trim()
			.isEmail()
			.custom(async (value, { req }) => {
				try {
					const user = await User.findOne({ email: value });
					if (user) {
						return Promise.reject(
							`User with this email ${value} already exists.`
						);
					}
				} catch (e) {
					console.log('Checking signup user existence error: ', e);
				}
			}),
		body('userName', "Filed 'Name' can't be empty.").trim().not().isEmpty(),
		body(
			'password',
			'Password should consists of numbers and text and be at least 6 characters.'
		)
			.trim()
			.isLength({ min: 6 })
			.isAlphanumeric(),
		body('repeated_password')
			.trim()
			.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords should match.');
			}
			return true;
		}),
	],
};
