//Imports from packages
const express = require('express');
//import mongoose
const mongoose = require('mongoose');
//imports from other files
const authRouter = require("./routes/auth"); //we can do like auth.js as well but without .js is possible
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user'); //we can do like user.js as well but without .js is possible

//initialize routes
const PORT = process.env.PORT || 3000;
const app = express();

const DB = "mongodb+srv://rejeb:700699@cluster0.hzx0i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);


//connections
mongoose.connect(DB).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // terminate the application immediately if connection fails
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

// app.get('/hello-world', (req, res) => { 
//     res.send('Welcome to the world');
// });
// app.get('/hello-world', (req, res) => { 
//     res.json({name: 'Rejeb'})
// });