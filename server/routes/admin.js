const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');
const { Product } = require('../models/product');
const Order = require('../models/order');

//add product

adminRouter.post('/admin/add-product', admin, async (req, res) => {
    try {
        const { name, description, images, quantity, price, category } = req.body; 
        let product = Product({
            name,
            description,
            images,
            quantity,
            price,
            category
        });

        //save to database
       product = await product.save();
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: e.message });
    }
});

//get all your products
adminRouter.get('/admin/get-products', admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Delete the product

adminRouter.post('/admin/delete-product', admin, async (req, res) => {
    try {
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//get orders to admin

adminRouter.get('/admin/get-orders', admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//change order status

adminRouter.post('/admin/change-order-status', admin, async (req, res) => {
    try {
        const { id, status } = req.body;
        let order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        order = await order.save();
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//analytics

adminRouter.get('/admin/analytics', admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        const totalEarnings = 0;

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].products.length; j++) {
                totalEarnings += orders[i].products[j].price * orders[i].products[j].quantity;
            }
        }

        //CATEGORY WISE ORDER FETCHING
        let applianceEarnings = await fetchCategoryWiseProduct('Appliances');
        let essentailEarnings = await fetchCategoryWiseProduct('Essentials');
        let mobileEarnings = await fetchCategoryWiseProduct('Mobiles');
        let bookEarnings = await fetchCategoryWiseProduct('Books');
        let fashionEarnings = await fetchCategoryWiseProduct('Fasion');
        
        let earnings = {
            applianceEarnings,
            essentailEarnings,
            mobileEarnings,
            bookEarnings,
            fashionEarnings,
            totalEarnings,
        };

        res.json(earnings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//function for fetch category wise product
async function fetchCategoryWiseProduct(category) {
    let earning = 0;
    let categoryOrders = await Order.find({
        'products.product.category': category,
    });
    for (let i = 0; i < categoryOrders.length; i++) {
        for (let j = 0; j < categoryOrders[i].products.length; j++) {
            earning += categoryOrders[i].products[j].price * categoryOrders[i].products[j].quantity;
        }
    }
    return earning;
}




module.exports = adminRouter;
