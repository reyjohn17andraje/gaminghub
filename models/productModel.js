const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Product Name is required.']
	},
	category: {
		type: String,
		required: [true, 'Product category is required.']
	},
	description: {
		type: String,
		required: [true, 'Product Description is required.']
	},
	price: {
		type: Number,
		required: [true, 'Product Price is required.']
	},
	src: {
		type: String,
		required: [true, 'Product Image is required.']
	},
	isAvailable: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
});


module.exports = mongoose.model("Product", productSchema);
