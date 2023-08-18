const express = require("express");
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");
const cors = require("cors")

const route = express();

route.use(bodyParser.urlencoded({
    extended: true
  }));
route.use(bodyParser.json());
route.use(cors());

route.post('/login', userController.userLogin);
route.post("/register", userController.createUser);
route.get('/getUser/:id', userController.getFileDetails);
route.get('/getUploadedData/:id', userController.getUploadedData);

//////////////////////////////////////////////////////////////////////
//                         USER AUTH                             ////
/////////////////////////////////////////////////////////////////////
route.post('/userAuthLogin', userController.userAuthLogin);
route.post('/userAuthRegister', userController.userAuthRegister);
route.post('/userAuthPassUpdate', userController.userAuthPassUpdate);
route.post('/userAuthDelete', userController.userAuthDelete);




module.exports = route;
