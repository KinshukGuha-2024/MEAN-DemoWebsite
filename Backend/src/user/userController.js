const userService = require("./userService");

exports.getDataControllerfn = async (req, res) => {
    try {
        const empdetails = await userService.getDataFromDBService();
        res.status(200).json({ error: false, message: "Data Found", data: empdetails });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: true, message: "Error fetching data" });
    }
};

exports.createDataControllerfn = async (Request, res) => {
    try {
        // Await the result of the user creation process
        const status = await userService.createUserDataFromDBService(Request.body);

        // Send a response based on the outcome
        if (status) {
            // Send success response
            return res.status(200).json({ error: false, message: "User Created Successfully.", data: [] });
        } else {
            // Send failure response if the status is falsy
            return res.status(400).json({ error: true, message: "Error Creating User.", data: [] });
        }
    } catch (error) {
        // Catch any error during the process and send an error response
        console.error("Error creating user:", error.message);
        return res.status(500).json({ error: true, message: "Error Creating User.", data: [] });
    }
};



exports.updateControllerfn = async (Request, res) => {
    try {
        const status = await userService.updateUserDataFromDBService(Request.body);
        if (status) {
            res.status(200).json({ error: false, message: "User Updated Successfully.", data: [] });
        } else {
            res.status(400).json({ error: true, message: "Error Updating User.", data: [] });
        }
    } catch (error) {
        console.error("Error Updating user:", error.message);
        res.status(500).json({ error: true, message: "Error Updating User.", data: [] });
    }
};

exports.deleteControllerfn = async (Request, res) => {
    try {
        const status = await userService.deleteUserDataFromDBService(Request.body.id);
        res.status(200).json(status);
    } catch (error) {
        console.error("Error Deleted user:", error.message);
        res.status(500).send({ error: true, message: "Error Deleted User.", data: [] });
    }
};





//--- Authentication Part ---


exports.studentAuthLogin = async (Request, res) => {
    try {
        const status = await userService.StudentAuthLogin(Request.body);
    
        if (!status.error) {
            res.status(200).json({
                success: true, 
                message: "Login was successful.", 
                data: status.data 
            });
        } else {
            res.status(401).json({
                success: false, 
                message: "Invalid credentials.", 
                data: [] 
            });
        }
    } catch (error) {
        console.error("Login error: ", error.message);
        res.status(500).json({
            success: false, 
            message: "Unable to process login request. Please try again later.", 
            data: []
        });
    }
};



