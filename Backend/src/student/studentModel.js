var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var studentSchema = new Schema({
    
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: true,
        match: [/^\+?[0-9]{10,13}$/, 'Please enter a valid phone number']
    },
    year: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4]  // Represents college year
    },
    applied_courses: {
        type: [String],  // Array of courses
        required: true
    },
    stream: {
        type: String,
        required: true,
        enum: ['BCA', 'MCA', 'BTech', 'Other']
    },
    information: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("student", studentSchema);
