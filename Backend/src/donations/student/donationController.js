const { request } = require("express");
const donationService = require("./donationService");

exports.createDonationControllerfn = async (Request, res) => {
    try {
        const status = await donationService.createDonationFromDBService(Request.body);
        if (status) {
            return res.status(200).json({ error: false, message: "Donation saved Successfully.", data: status });
        } else {
            return res.status(400).json({ error: true, message: "Error Creating Donation.", data: [] });
        }
    } catch (error) {
        console.error("Error creating Donation Service:", error.message);
        return res.status(500).json({ error: true, message: "Server Error.", data: [] });
    }
};


exports.getTotalCountDonationControllerfn = async (req, res) => {
    try {
        const donationCount = await donationService.getTotalCountDonationFromDBService();
        res.status(200).json({ error: false, message: "", data: donationCount });
    } catch (error) {
        console.error("Error fetching donation data:", error.message);
        res.status(500).json({ error: true, message: "Error fetching donation data" });
    }
};




