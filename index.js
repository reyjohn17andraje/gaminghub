require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extened:true}));
app.use(cors());

mongoose.connect("mongodb+srv://reyjohnandraje2002:admin@cluster0.6ki5z6l.mongodb.net/vergie_store_api?retryWrites=true&w=majority");

mongoose.connection.once('open', () => console.log('You are now connected to MongoDB Atlas.'));

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);

if(require.main === module){
	app.listen(port, () => {
		console.log(`API is now online on port ${port}`)
	});
}

module.exports = { app, mongoose };