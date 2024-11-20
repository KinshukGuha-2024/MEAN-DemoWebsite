const userModel = require("./userModel");
const bcrypt = require('bcrypt');

module.exports.getDataFromDBService = async () => {
    try {
        // Assuming userModel is a valid Mongoose model
        const result = await userModel.find({});
        return result;  // Return the data if successful
    } catch (error) {
        // Reject with the error message to give more context
        throw new Error('Failed to fetch data from the database: ' + error.message);
    }
};


module.exports.createUserDataFromDBService =  async (userDetails) => {
    try {
        const userModelData = new userModel();


       

        userModelData.name = userDetails.name;
        userModelData.address = userDetails.address;
        userModelData.email = userDetails.email;
        userModelData.phone = userDetails.phone;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

        userModelData.password = hashedPassword;

        // Save the user data asynchronously using await
        const result =  await userModelData.save();  // This now returns a promise

        return result;  // Return the saved result

    } catch (error) {
        throw new Error('Error saving user data: ' + error.message);  // Throw error to be handled by the controller
    }
};

module.exports.updateUserDataFromDBService =  async (userDetails) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userDetails.id,                // Find user by ID
            {                               // Fields to update
                name: userDetails.name,
                address: userDetails.address,
                email: userDetails.email,
                phone: userDetails.phone
            },
            { new: true }                   // Return the updated document
        );

        return updatedUser;

    } catch (error) {
        throw new Error('Error Updating user data: ' + error.message);  // Throw error to be handled by the controller
    }
};

module.exports.deleteUserDataFromDBService =  async (userId) => {

    try {
        const deleteUser = await userModel.findByIdAndDelete(userId);

        if(!deleteUser){
            throw new Error('User Not Found..');
        }

        return { message: "User Deleted Successfully..", deleteUser};

    } catch (error) {
        throw new Error('Error Deleted user data: ' + error.message);  // Throw error to be handled by the controller
    }
};



module.exports.StudentAuthLogin = async (studentDetails) => {
    try {
        // Assuming userModel is a valid Mongoose model

        const userDetails = await userModel.findOne({ email: studentDetails.email });

        if (!userDetails) {
            // Return an error if user is not found
            return { error: true, data: [] };
        }
        
        const isPasswordValid = await bcrypt.compare(studentDetails.password, userDetails.password);

        if (!isPasswordValid) {
            // Return error if password is invalid
            return { error: true, data: [] };
        }

        // Return successful login with user details
        return { error: false, data: { name: userDetails.name, id: userDetails._id } };
            
    } catch (error) {
        // Reject with the error message to give more context
        throw new Error('Failed to fetch data from the database: ' + error.message);
    }
};
