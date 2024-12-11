
// --- Connection For Express ---
require('dotenv').config();
var express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var routes = require('./routes/routes');
const bodyParser = require('body-parser');
const cors = require("cors");

var server = express();
server.use(bodyParser.json()); 
server.use(cors());
server.use(routes);
server.use(express.static('public'));
server.use('/uploads', express.static('uploads'));


server.listen(8000, function check(error){
    if(error) {
        console.log("Cannot establish connection for Express");
    }
    else {
        console.log("Connection established for Express");
    }
});


// --- Connection For MongoDB ---
var mongoose = require("mongoose");
async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://webgrity158:kinshuk1234@cluster0.0e2hg.mongodb.net/");
        console.log("Connection established for MongoDB");
    } catch (error) {
        console.log("Cannot establish connection for MongoDB:", error.message);
    }
}
connectDB();


server.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount, firstName, lastName, email, recur_type } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,  
        currency: 'USD',       
        description: `Donation from ${firstName} ${lastName} for ${recur_type} payment`,
        receipt_email: email,
        metadata: {
          recur_type: recur_type,  
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim()
        },
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).send({ error: 'Failed to create payment intent' });
    }
  });
  
server.post('/confirm-payment', async (req, res) => {
    const { paymentIntentId, paymentMethodId } = req.body;
    if (!paymentIntentId || !paymentMethodId) {
        return res.status(400).json({ error: 'Missing payment intent or payment method' });
    }
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
        });
        if (paymentIntent.status === 'succeeded') {
        res.send({ success: true, message: paymentIntent });
        } else {
        res.status(400).send({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).send({ error: error.message });
    }
});


