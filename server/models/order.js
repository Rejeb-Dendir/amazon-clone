const mongoose = require('mongoose');
const { productSchema } = require('./product');

const orderSchema = mongoose.Schema({
     products: [{
        product: productSchema,
         quantity: {
            type: Number,
            required: true
        },
    },],
    totalPrice: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: false,
        default: 'Addis Ababa',
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0 // 0 for pending, 1 for shipped, 2 for delivered, 3 for cancelled
    },
    orderedAt: {
        type: Number,
        required: true
    }

})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;