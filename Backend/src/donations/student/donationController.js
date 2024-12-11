const { request } = require("express");
const donationService = require("./donationService");

exports.createDonationControllerfn = async (Request, res) => {
    try {
        // console.log('Request',Request.body);
        const status = await donationService.createDonationFromDBService(Request.body);
        if (status) {
            return res.status(200).json({ error: false, message: "Donation saved Successfully.", data: status.stripe_transaction_id });
        } else {
            return res.status(400).json({ error: true, message: "Error Creating Donation.", data: [] });
        }
    } catch (error) {
        console.error("Error creating Donation Service:", error.message);
        return res.status(500).json({ error: true, message: "Server Error.", data: [] });
    }
};




