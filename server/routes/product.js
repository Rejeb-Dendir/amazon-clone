const express = require('express');
const productRouter = express.Router();
const auth = require('../middlewares/auth');
const { Product } = require('../models/product');


//get all your products
productRouter.get('/api/products', auth, async (req, res) => {
    try {
        const products = await Product.find({category: req.query.category});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//search a product
productRouter.get('/api/products/search/:name', auth, async (req, res) => {
    try {
        const products = await Product.find({
            
                name: { $regex: req.params.name, $options: 'i' },
            
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// a post request rout to rate product

productRouter.post('/api/rate-product', auth, async (req, res) => {
    try {
        const { id, rating } = req.body;
        let product = await Product.findById(id);

        for (let i = 0; i < product.ratings.length; i++) {
    if (product.ratings[i].userId == req.user) {
        product.ratings.splice(i, 1); // Use splice on product.ratings, not product.ratings[i]
        break;
    }
}


        const ratingSchema = {
            userId: req.user,
            rating,
        }

        product.ratings.push(ratingSchema);
        product = await product.save();
        res.json(product);
       // product.rating = product.ratings.reduce((acc, curr) => acc + curr.rating, 0) / product.ratings.length;
        
    } catch (error) {

        res.status(500).json({ error: error.message });
    }


});

//get deal of the day a product which has highest rating

productRouter.get('/api/deal-of-day', auth, async (req, res) => {
    try {
        let products = await Product.find({});
        
        products = products.sort((a, b) => {
            let aSum = 0;
            let bSum = 0;

            for (let i = 0; i < a.ratings.length; i++) {
                aSum += a.ratings[i].rating;
            }
            for (let i = 0; i < b.ratings.length; i++) {
                bSum += b.ratings[i].rating;
            }
            return bSum - aSum;
        });
        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = productRouter;