const studentModelComp = require("./studentModel");
const fs = require('fs');
const path = require('path');
const {ObjectId} = require('mongodb');
module.exports.getDataFromDBService = async (studentId = null) => {
    try {
        if(studentId) {
            const objId = new ObjectId(studentId);
            
            const result = await studentModelComp.findById(objId);
        
            if (!result) {
                throw new Error('Student not found');
            }
            return result; // Return the transformed data

        }
        else {
            const result = await studentModelComp.aggregate([
                {
                    $addFields: {
                        yearlabel: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$year", 1] }, then: "First" },
                                    { case: { $eq: ["$year", 2] }, then: "Second" },
                                    { case: { $eq: ["$year", 3] }, then: "Third" },
                                    { case: { $eq: ["$year", 4] }, then: "Fourth" }
                                ],
                                default: "unknown" // Fallback value for unexpected cases
                            }
                        }
                    }
                }
            ]);
            return result; // Return the transformed data

        }

    } catch (error) {
        throw new Error('Failed to fetch data from the database: ' + error.message);
    }
};

module.exports.createStudentDataFromDBService = async (studentDetails) => {
  

    try {
        const studentModel = new studentModelComp();

        // Extract fields from studentDetails, which should match the form inputs
        studentModel.first_name = studentDetails.first_name;  // Map form first name to the model's field
        studentModel.last_name = studentDetails.last_name;    // Map form last name to the model's field
        studentModel.phone = studentDetails.phone;            // Phone number
        studentModel.email = studentDetails.email;            // Email
        studentModel.address = studentDetails.address;        // Address
        studentModel.year = studentDetails.year;              // College Year
        studentModel.applied_courses = studentDetails.applied_courses || []; // Applied courses, ensuring it's an array
        studentModel.stream = studentDetails.stream;          // Stream (BCA, MCA, BTech, etc.)
        studentModel.information = studentDetails.information || ''; // Additional information
        
        // Handle the image (base64 string) if provided
        if (studentDetails.image) {
            const base64Image = studentDetails.image;
            const matches = base64Image.match(/^data:image\/([a-z]+);base64,/);

            // If valid base64 image string
            if (matches) {
                const imageFormat = matches[1]; // Extracts format, e.g., png, jpeg
                const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');
                
                // Create a unique file name or use the one provided
                const fileName = `student_image_${Date.now()}.${imageFormat}`;
                const uploadDir = path.join( 'uploads', 'student');
                const uploadPath = path.join(uploadDir, fileName);

                // Check if directory exists, if not, create it
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Save the image to the disk
                fs.writeFileSync(uploadPath, imageBuffer);

                // Store the image path in the model
                studentModel.image = `uploads/student/${fileName}`;
            } else {
                throw new Error('Invalid image format');
            }
        } else {
            studentModel.image = ''; // If no image, set to an empty string
        }

        // Save the student data asynchronously using await
        const result = await studentModel.save();  // This now returns a promise

        return result;  // Return the saved result

    } catch (error) {
        throw new Error('Error saving student data: ' + error.message);  // Throw error to be handled by the controller
    }
};


module.exports.updateStudentrDataFromDBService =  async (studentDetails) => {
    console.log(studentDetails);
    try {


        if (studentDetails.image) {
            const base64Image = studentDetails.image;
            const matches = base64Image.match(/^data:image\/([a-z]+);base64,/);

            // If valid base64 image string
            if (matches) {
                const imageFormat = matches[1]; // Extracts format, e.g., png, jpeg
                const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');
                
                // Create a unique file name or use the one provided
                const fileName = `student_image_${Date.now()}.${imageFormat}`;
                const uploadDir = path.join( 'uploads', 'student');
                const uploadPath = path.join(uploadDir, fileName);

                // Check if directory exists, if not, create it
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Save the image to the disk
                fs.writeFileSync(uploadPath, imageBuffer);

                // Store the image path in the model
                studentModelComp.image = `uploads/student/${fileName}`;
            } else {
                throw new Error('Invalid image format');
            }
        } else {
            studentModelComp.image = ''; // If no image, set to an empty string
        }

        const updatedStudent = await studentModelComp.findByIdAndUpdate(
            studentDetails.studentId,                // Find student by ID
            {                             
                first_name: studentDetails.first_name,
                last_name: studentDetails.last_name,
                address: studentDetails.address,
                email: studentDetails.email,
                phone: studentDetails.phone,
                year: studentDetails.year,
                applied_courses: studentDetails.applied_courses,
                stream: studentDetails.stream,
                information: studentDetails.information


            },
            { new: true }                   // Return the updated document
        );

        return updatedStudent;

    } catch (error) {
        throw new Error('Error Updating Student data: ' + error.message);  // Throw error to be handled by the controller
    }
};


module.exports.deleteStudentDataFromDBService =  async (studentId) => {

    try {
        const deleteStudent = await studentModelComp.findByIdAndDelete(studentId);

        if(!deleteStudent){
            throw new Error('Student Not Found..');
        }

        return { message: "Student Deleted Successfully..", deleteStudent};

    } catch (error) {
        throw new Error('Error Deleted student data: ' + error.message);  // Throw error to be handled by the controller
    }
};


