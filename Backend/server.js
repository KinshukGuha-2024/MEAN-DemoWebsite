
// --- Connection For Express ---
var express = require("express");
var routes = require('./routes/routes');
const bodyParser = require('body-parser');
const cors = require("cors");

var server = express();
server.use(bodyParser.json()); 
server.use(cors());
server.use(routes);
server.use(express.static('public'));
server.use('/uploads', express.static('uploads'));


server.listen(8000, function check(error){
    if(error) {
        console.log("Cannot establish connection for Express");
    }
    else {
        console.log("Connection established for Express");
    }
});


// --- Connection For MongoDB ---
var mongoose = require("mongoose");
async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://webgrity158:kinshuk1234@cluster0.0e2hg.mongodb.net/");
        console.log("Connection established for MongoDB");
    } catch (error) {
        console.log("Cannot establish connection for MongoDB:", error.message);
    }
}
connectDB();


