var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var donationSchema = new Schema({
    
    customer_name: {
        type: String,
        required: true
    },
    stripe_transaction_id: {
        type: String,
        required: true
    },
    receipt_email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    recur_type: {
        type: Number,
        required: true,
        enum: [1, 2, 3]  
    },
    amount: {
        type: Number,  
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    transaction_date: {
        type: Date,  
        required: true,
        default: Date.now 
    }
   
});

module.exports = mongoose.model("donation", donationSchema);
