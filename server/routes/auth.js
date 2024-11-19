const express = require("express");
const User = require("../models/user.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth.js");
const authRouter = express.Router();

//SIGN UP
authRouter.post('/api/signup', async (req, res) => {
    try {
        //get the data from the client
    const { name, email, password } = req.body;
    //post the data to the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: "User with the same email already exists" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        let user = new User({
            name,
            email,
            password: hashedPassword,
        });
    user = await user.save();
    //send back the user data to the client
    res.json({ user }); //(user) is the same as (user: user)
    } catch (err) { 
        console.log(err);
        res.status(500).json({error: err.message});
    }
});

//SIGN IN route
authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found with this email" });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }
       const token = jwt.sign({ id: user._id }, "passwordKey");
        //send back the user data to the client
        res.json({token, ...user._doc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//validate the token
authRouter.post('/api/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token)
            return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified)
            return res.json(false);
        const user = await User.findById(verified.id);
        if (!user)
            return res.json(false);
        res.json(true);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//get user data
authRouter.get('/', auth, async (req, res) => { 
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});  
});
//making this file available in our app so other file can import and use it
module.exports = authRouter;
//module.exports = { authRouter, name: 'Rejeb' }; //foe the key authRouter we did not use colon b/c the key and value are the same so it is a short hand



//the other possible way to accept, send and return data
/**
 await User.findOne({ email })
 .then(user => {
            if (user) {
                return res.status(400).json({ msg: "User already exists!" });
            } else {
                let newUser = new User({ name, email, password });
                //encrypt the password
                newUser.password = bcrypt.hashSync(password, 10);
                 newUser
                   .save()
                   .then(user => {
                        res.json({ msg: "User registered successfully" });
                    })
                   .catch(err => console.error(err));
            }
        })
       .catch(err => console.error(err));
 */