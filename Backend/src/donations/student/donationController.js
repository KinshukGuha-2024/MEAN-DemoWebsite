const { request } = require("express");
const studentService = require("./donationService");

exports.getDataControllerfn = async (req, res) => {
    try {
        const { studentId } = req.query;

        // Call service to fetch data
        const empdetails = await studentService.getDataFromDBService(studentId || null);

        if (empdetails.length === 0) {
            // Return a 200 response with no error but an informative message
            return res.status(200).json({ error: false, message: "No data found", data: [] });
        }

        // Return the data if found
        res.status(200).json({ error: false, message: "Data Found", data: empdetails });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: true, message: "Error fetching data" });
    }
};



exports.createDataControllerfn = async (Request, res) => {
    try {
        // Await the result of the student creation process
        const status = await studentService.createStudentDataFromDBService(Request.body);

        // Send a response based on the outcome
        if (status) {
            // Send success response
            return res.status(200).json({ error: false, message: "Student Created Successfully.", data: [] });
        } else {
            // Send failure response if the status is falsy
            return res.status(400).json({ error: true, message: "Error Creating Student.", data: [] });
        }
    } catch (error) {
        // Catch any error during the process and send an error response
        console.error("Error creating Student:", error.message);
        return res.status(500).json({ error: true, message: "Server Error.", data: [] });
    }
};

exports.updateControllerfn = async (Request, res) => {
    try {
        const status = await studentService.updateStudentrDataFromDBService(Request.body);
        if (status) {
            res.status(200).json({ error: false, message: "Student Updated Successfully.", data: [] });
        } else {
            res.status(400).json({ error: true, message: "Error Updating Student.", data: [] });
        }
    } catch (error) {
        console.error("Error Updating Student:", error.message);
        res.status(500).json({ error: true, message: "Error Updating Student.", data: [] });
    }
};


exports.deleteControllerfn = async (Request, res) => {
    try {
        const status = await studentService.deleteStudentDataFromDBService(Request.body.id);
        res.status(200).json(status);
    } catch (error) {
        console.error("Error Deleting Student:", error.message);
        res.status(500).send({ error: true, message: "Error Deleting Student.", data: [] });
    }
};


