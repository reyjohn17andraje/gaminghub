const bcrypt = require("bcrypt");
const Order = require("../models/orderModel");
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const auth = require("../auth");

module.exports.checkout = (req, res) => {
    const userId = req.user.id;
    Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found for the user' });
            }
            if (cart.cartItems.length > 0) {
                const totalAmount = cart.totalPrice;
                if (!totalAmount) {
                    return res.status(400).json({ message: 'Total price is missing in the cart' });
                }
                const newOrder = new Order({
                    userId: cart.userId,
                    cartItems: cart.cartItems,
                    totalAmount: totalAmount,
                });
                return newOrder.save()
                    .then(() => {
                        return Cart.findOneAndDelete({ userId })
                            .then(() => {
                                res.status(200).json({ message: 'Order placed successfully', order: newOrder });
                            });
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({ message: 'Error during checkout', error: error.message });
                    });
            } else {
                return res.status(400).json({ message: 'Cart is empty' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error during checkout', error: error.message });
        });
};

module.exports.myorders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId });
        if (orders.length === 0) {
            res.status(404).json({ message: 'No orders found for the user' });
        } else {
            res.status(200).json({ orders });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports.allorders = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const orders = await Order.find();
        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
