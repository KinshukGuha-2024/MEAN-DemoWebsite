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

        const paymentTypes = ['one-time', 'monthly', 'annually'];

        for (let type of paymentTypes) {
            const regex = new RegExp(`\\b${type}\\b`, 'i');
            if (regex.test(text)) {
                recurtype_txt = type;
            }
        }

        let recur_value;
        if (recurtype_txt === 'one-time') {
            recur_value = 1;
        } else if (recurtype_txt === 'monthly') {
            recur_value = 2;
        } else if (recurtype_txt === 'annually') {
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
        throw new Error('Error saving Donation data: ' + error.message);  
    }
};

module.exports.getTotalCountDonationFromDBService = async () => {
    try {
        const donations = await donationModelComp.find({});
        const total = donations.reduce((sum, donation) => {
            return sum + (donation.amount / 100); 
        }, 0);

        return total;  

    } catch (error) {
        throw new Error('Failed to fetch data from the database: ' + error.message);
    }
};




