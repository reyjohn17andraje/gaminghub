const bcrypt = require("bcrypt");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const auth = require("../auth");


module.exports.getcart = (req, res) => {
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ error: "No cart found" });
            } else {
                return res.status(200).send({ cart: cart });
            }
        })
        .catch(err => {
            console.error("Error in getting cart:", err);
            return res.status(500).send({ error: "Failed to get the cart" });
        });
};

module.exports.addtocart = (req, res) => {
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            }
            const subTotal = req.body.quantity * product.price;
            const newCartItem = {
                productId: product.id,
                name: product.name,
                quantity: req.body.quantity,
                price: product.price,
                subTotal: subTotal,
            };
            return Cart.findOne({ userId: req.user.id }).then(cart => {
                if (!cart) {
                    cart = new Cart({
                        userId: req.user.id,
                        cartItems: [newCartItem],
                        totalPrice: subTotal,
                    });
                } else {
                    cart.cartItems.push(newCartItem);
                    cart.totalPrice += subTotal;
                }
                return cart.save();
            });
        })
        .then(cart => {
            res.status(200).json({ message: 'Product added to cart successfully', cart: cart });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};

module.exports.updatecartquantity = (req, res) => {
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            }
            return Cart.findOne({ userId: req.user.id }).then(cart => {
                const subTotal = req.body.quantity * product.price;
                if (!cart) {
                    cart = new Cart({
                        userId: req.user.id,
                        cartItems: [],
                        totalPrice: 0,
                    });
                }
                const existingProductIndex = cart.cartItems.findIndex(item => item.productId === req.body.productId);

                if (existingProductIndex !== -1) {
                    cart.cartItems[existingProductIndex].quantity = req.body.quantity;
                    cart.cartItems[existingProductIndex].subTotal = subTotal;
                } else {
                    const newCartItem = {
                        productId: product.id,
                        name: product.name,
                        quantity: req.body.quantity,
                        price: product.price,
                        subTotal: subTotal,
                    };
                    cart.cartItems.push(newCartItem);
                }
                cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);
                return cart.save();
            });
        })
        .then(cart => {
            res.status(200).json({ message: 'Cart updated successfully', cart: cart });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};

module.exports.removefromcart = (req, res) => {
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ error: "Cart not found" });
            }
            const itemIndex = cart.cartItems.findIndex(item => item.productId === req.params.productId);
            if (itemIndex !== -1) {
                const removedItem = cart.cartItems.splice(itemIndex, 1)[0];
                cart.totalPrice -= removedItem.subTotal;
                return cart.save().then(updatedCart => {
                    res.status(200).json({ message: 'Item deleted from cart successfully', cart: updatedCart });
                });
            } else {
                return res.status(404).send({ error: "Item not found in cart" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};


module.exports.clearcart = (req, res) => {
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ error: "Cart not found" });
            }
            cart.cartItems = [];
            cart.totalPrice = 0;
            return cart.save().then(updatedCart => {
                res.status(200).json({ message: 'Cart cleared successfully', cart: updatedCart });
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};
