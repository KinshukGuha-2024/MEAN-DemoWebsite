var express = require("express");
const router = express.Router();
var userController = require("../src/user/userController");
var studentController = require("../src/student/studentController");


// User Routes
router.route('/user').get(userController.getDataControllerfn);
router.route('/user').post(userController.createDataControllerfn);
router.route('/user/update').post(userController.updateControllerfn);
router.route('/user/delete').post(userController.deleteControllerfn);


// Student Routes
router.route('/student').get(studentController.getDataControllerfn);
router.route('/student').post(studentController.createDataControllerfn);
router.route('/student/update').post(studentController.updateControllerfn);
router.route('/student/delete').post(studentController.deleteControllerfn);






//Auth Routes 
router.route('/student/auth/login').post(userController.studentAuthLogin);



module.exports = router;
