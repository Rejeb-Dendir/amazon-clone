const mongoose = require('mongoose');
const {productSchema} = require('./product');

//user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return re.test(value);
            },
            message: 'Invalid email address'
        }

    },
    password: {
        type: String,
        required: true,
        validator: {
            validator: (value) => {
                return value.length >= 6;
            },
            message: 'Password must be at least 6 characters long'
        }
    },
    address: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        // enum: ['user', 'admin'],
        default: 'user',
    },
    cart: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
                
            }
        }
    ]


});

//user model

const User = mongoose.model('user', userSchema);

module.exports = User;