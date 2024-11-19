const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/auth');
const { Product } = require('../models/product');
const User = require("../models/user.js");
const Order = require('../models/order.js');


//add to cart

userRouter.post('/api/add-to-cart', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);

        if (user.cart.length == 0) {
            user.cart.push({ product, quantity: 1 });
            
        } else {
            let isProductIsFound = false;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].product._id.toString() === product._id.toString()) {
                    isProductIsFound = true;
                }
            }
            if (isProductIsFound) {
                let productFound = user.cart.find((foundedProduct) =>
                    foundedProduct.product._id.toString()=== product._id.toString()
                );
                productFound.quantity++;
            } else {
                user.cart.push({ product, quantity: 1 });
            }
        }
        user = await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.delete('/api/remove-from-cart/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);

        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id.toString() === product._id.toString()) {
                if (user.cart[i].quantity == 1) {
                     user.cart.splice(i, 1);  //delete one product at i
                } else {
                    user.cart[i].quantity--; //decrease quantity of product at i
                }
            }
        }  
        user = await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//save user address
userRouter.post('/api/save-user-address', auth, async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user = await user.save();
        res.json(user);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//order product
userRouter.post('/api/order', auth, async (req, res) => {
    try {
        const { cart, totalPrice, address } = req.body;
        let products = [];

        for (let i = 0; i < cart.length; i++) {
            let product = await Product.findById(cart[i].product._id);
            if (product.quantity >= cart[i].quantity) {
                product.quantity -= cart[i].quantity;
                products.push({
                product,
                quantity: cart[i].quantity
            });
                await product.save();
            } else {
                res.status(400).json({ msg: `${product.name} is out of stock!` });
            }  
        }
        
        let user = await User.findById(req.user);
        user.cart = [];
        user = await user.save();

        let order = new Order({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//get user orders

userRouter.get('/api/orders/me', auth, async (req, res) => {
    try {
        let orders = await Order.find({ userId: req.user }).sort({ orderedAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = userRouter;