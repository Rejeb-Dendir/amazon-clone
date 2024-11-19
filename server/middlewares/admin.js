const jwt = require('jsonwebtoken');
const User = require('../models/user');

const admin = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'No token, access denied' });
        }
        const verified = jwt.verify(token, 'passwordKey');
        if (!verified) {
            return res.status(401).json({ msg: 'Token is not valid, authorization denied' });
        }
        const user = await User.findById(verified.id);
        if (user.type == 'user' || user.type == 'seller') {
            return res.status(401).json({ msg: 'You are not an admin, authorization denied' });
        }

        req.user = verified.id;
        req.token = token;
        next();
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }

};

module.exports = admin;