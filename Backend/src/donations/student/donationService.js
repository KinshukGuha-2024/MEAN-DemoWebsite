const donationModelComp = require("./donationModel");
const fs = require('fs');
const path = require('path');
const {ObjectId} = require('mongodb');


module.exports.createDonationFromDBService = async (donationDetails) => {
    try {
        const donationModel = new donationModelComp();

        const text = donationDetails.description;

        const nameMatch = text.match(/from ([a-zA-Z\s]+) for/i);
        const name = nameMatch ? nameMatch[1].trim() : null;

        const paymentMatch = text.match(/(\b\w+-\w+\b) payment/i);
        const fullWordBeforePayment = paymentMatch ? paymentMatch[1] : null;
        let recur_value;

        if (fullWordBeforePayment === 'one-time') {
            recur_value = 1;
        } else if (fullWordBeforePayment === 'monthly') {
            recur_value = 2;
        } else if (fullWordBeforePayment === 'yearly') {
            recur_value = 3;
        } else {
            recur_value = null;
        }
        
        donationModel.customer_name = name;  
        donationModel.stripe_transaction_id = donationDetails.id;    
        donationModel.receipt_email = donationDetails.receipt_email;            
        donationModel.status = donationDetails.status;            
        donationModel.recur_type = recur_value;        
        donationModel.amount = donationDetails.amount;              
        donationModel.description = donationDetails.description;  
        
        const result = await donationModel.save(); 

        return result;  

    } catch (error) {
        throw new Error('Error saving Donation data: ' + error.message);  // Throw error to be handled by the controller
    }
};



