var express = require("express");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const transporter = require('../email');
const router = express.Router();
var userController = require("../src/user/userController");
var studentController = require("../src/student/studentController");
var donationController = require("../src/donations/student/donationController");


// User Routes
router.route('/user').get(userController.getDataControllerfn);
router.route('/user').post(userController.createDataControllerfn);
router.route('/user/update').post(userController.updateControllerfn);
router.route('/user/delete').post(userController.deleteControllerfn);


// Student Routes
router.route('/student').get(studentController.getDataControllerfn);
router.route('/student').post(studentController.createDataControllerfn);
router.route('/student/update').post(studentController.updateControllerfn);
router.route('/student/delete').post(studentController.deleteControllerfn);



//Donation Route
router.route('/donation/save-data').post(donationController.createDonationControllerfn);
router.route('/donation/total').get(donationController.getTotalCountDonationControllerfn);



//Auth Routes 
router.route('/student/auth/login').post(userController.studentAuthLogin);




function formatTransactionDate(isoDate) {
    const date = new Date(isoDate);

    // Get formatted components
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = date.toLocaleString('en-US', { month: 'short' }); // Short month name
    const year = date.getFullYear();

    // Get time and format it in 12-hour format with AM/PM
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

    return `${day}-${month}-${year} (${formattedHours}.${minutes} ${period})`;
}


router.post('/text-mail', (req, res) => {
    const {to, donorName, donateAmt, paymentId, transactionDate } = req.body;
    const formattedTransactionDate = formatTransactionDate(transactionDate);
    const formattedDonateAmt = donateAmt/100;
    const mailData = {
        from: 'webgrity158@gmail.com',
        to: to,  // dynamically set recipient
        subject: `Thank You for Your Generous Donation of ${formattedDonateAmt}!`,  // subject line
        text: `Dear ${donorName},\n\nThank you for your generous donation of $${formattedDonateAmt}.\n\nPayment ID: ${paymentId}\nTransaction Date: ${formattedTransactionDate}\n\nWe appreciate your support!`, // plain text version
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You for Your Generous Donation!</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        background-color: #4CAF50;
                        color: #ffffff;
                        padding: 15px;
                        border-radius: 8px 8px 0 0;
                    }
                    .content {
                        margin-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                    }
                    .button {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 4px;
                        display: inline-block;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You for Your Donation!</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${donorName},</p>
                        <p>We are deeply grateful for your generous donation of <strong>$${formattedDonateAmt}</strong>. Your contribution will help us continue our mission and support our cause in meaningful ways.</p>
                        <p>Your donation has been successfully processed. Below are the details of your donation:</p>
                        <ul>
                            <li><strong>Donation Amount:</strong> $${formattedDonateAmt}</li>
                            <li><strong>Payment ID:</strong> ${paymentId}</li>
                            <li><strong>Transaction Date:</strong> ${formattedTransactionDate}</li>
                        </ul>
                        <p>Once again, thank you for your support. We couldn't do it without you!</p>
                        <p>If you have any questions or need further assistance, feel free to reach out to us at any time.</p>
                        <p>Warm regards,</p>
                        <p><strong>Demo Website</strong></p>
                        <a href="192.168.0.86:4200/" class="button">Visit Our Website</a>
                    </div>
                    <div class="footer">
                        <p>If you did not make this donation, please contact us immediately at [contact@demoproject.com].</p>
                        <p>Follow us on <a href="#">Facebook</a> | <a href="#">Twitter</a></p>
                    </div>
                </div>
            </body>
            </html>
            `,
        };
    

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});


router.post('/create-payment-intent', async (req, res) => {
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
  
  router.post('/confirm-payment', async (req, res) => {
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



module.exports = router;
