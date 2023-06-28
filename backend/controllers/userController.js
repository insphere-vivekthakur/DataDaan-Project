// const organizationDetail = require("../models/Organisation");
const File = require("../models/file");
const User = require("../models/User");
const JWT = require("../utils/JWT.js");
const saltRounds = 10;
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;

const securePassword = (password) =>
  bcrypt
    .genSalt(saltRounds)
    .then((data) => bcrypt.hash(password, data).then((item) => item));

const getToken = (userId) =>
  JWT.createtoken({ _id: userId }, process.env.TOKEN_SECRET);

const createUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      mobile,
      address1,
      address2,
      address3,
      city,
      landmark,
      pincode,
    } = req.body;

    let isUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] }).exec();
    if (isUser && isUser !== null) {
      return res.status(400).send({
        code: 400,
        message: "email/mobile already exist",
        data: {},
      });
    } else {
      // console.log(isUser, 'user doesnot exist');
      const spassword = await securePassword(password);

      const userData = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: spassword,
        mobile: mobile,
        address1: address1,
        address2: address2,
        address3: address3,
        city: city,
        landmark: landmark,
        pincode: pincode,
      });

      let result = await userData.save();
      if (result) {
        await User.findByIdAndUpdate(result._id, { token: getToken(result._id) });
        const updatedData = await User.findById(result._id).exec();
        return res.status(200).send({
          code: 200,
          message: "Register Success",
          status:"success",
          data: updatedData,
        });
      } else {
        return res.status(400).send({
          code: 400,
          message: "something went wrong",
          status:"failed",
          data: {},
        });
      }
    }
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ status: 500, message: errorMessage });
  }
};

////////Login

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      // const passwordMatch = bcrypt.compare(password,userData.password).then(item=>{
      //   return item
      // });
      bcrypt.compare(password, userData.password, function (err, success) {
        if (err) {
          console.log(err);
        } else {
          if (success) {
            const userResult = {
              _id:userData._id,
              firstname: userData.firstname,
              lastname: userData.lastname,
              email: userData.email,
              password: userData.password,
              mobile: userData.mobile,
              address1: userData.address1,
              address2: userData.address2,
              address3: userData.address3,
              city: userData.city,
              landmark: userData.landmark,
              pincode: userData.pincode,
              token: userData.token
            };
            const response = {
              success: true,
              msg: "login successfull",
              data: userResult,
            };
            res.status(200).send(response);
          } else {
            res
              .status(200)
              .send({ success: false, msg: "login details are incorrect" });
          }
          // console.log(success, "hello2");
        }
      });
      // console.log(passwordMatch)

    } else {
      res
        .status(200)
        .send({ success: false, msg: "login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

///
const getFileDetails = async (req, res) => {
  try {
    const user = await File.find({ submittedBy: new ObjectId(req.params.id) });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUploadedData = async (req, res) => {
  try {
    const data = await File.find({ submittedBy: new ObjectId(req.params.id) });
    if (data) {
      return res.status(200).send({
        code: 200,
        message: "All uploaded data",
        data: data,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}


const getSearchedData = async (req, res) => {
  try {
    const data = await File.find({ submittedBy: new ObjectId(req.params.id) });
    if (data) {
      return res.status(200).send({
        code: 200,
        message: "All uploaded data",
        data: data,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  createUser,
  userLogin,
  getFileDetails,
  getUploadedData
};
