// const organizationDetail = require("../models/Organisation");
const File = require("../models/file");
const User = require("../models/User");
const JWT = require("../utils/JWT.js");
const saltRounds = 10;
const bcrypt = require('bcrypt');
const ObjectId = require("mongoose").Types.ObjectId;

const securePassword = (password) =>
  bcrypt
    .genSalt(saltRounds)
    .then((data) => bcrypt.hash(password, data).then((item) => item));
const passwordMatch = (enteredPassword, userPassword) =>
  bcrypt.compare(enteredPassword, String(userPassword).trim());

const getToken = (userId) => JWT.createtoken({ _id: userId }, process.env.TOKEN_SECRET);

const createUser = async (req, res) => {

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
    pincode
  } = req.body;
  // console.log(req.body)
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
    pincode: pincode
  });

  let result = await userData.save();
  if (result) {
    await User.findByIdAndUpdate(result._id, { token: getToken(result._id) });
    const updatedData = await User.findById(result._id).exec();
    return res.status(200).send({
      code: 200,
      message: "Register Success",
      data: updatedData
    });
  } else {
    return res.status(200).send({
      code: 200,
      message: "Register Success",
      data: result
    });
  }
}


////////Login 

const userLogin = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;

  const user = await User.aggregate(
    [

      { $lookup: { from: "organisationdetails", localField: "organization", foreignField: "_id", as: "organizationObj" } },
      { $unwind: { path: "$organizationObj" } },
      { $match: { $or: [{ "email": email }, { "organizationObj.email": email }] } },
      // {$project:{"document": "$$ROOT","organizationObj":1}},


    ]
  )
  console.log(user)

  if (!user || !user.length) {
    return res.json({ "response": "user not found" })
  }

  console.log(user)
  const data = await passwordMatch(password, user[0].organizationObj.password)
  if (data) {
    delete user[0].organizationObj.password
    delete user[0].password
    return res.json({ "response": "login succesfull", user: user })
  }
  else {
    return res.json({ "response": "login incorrect" })
  }

};

///
const getfileDetails = async (req, res) => {
  try {

    const user = await File.find(new ObjectId(req.params.id))
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error retrieving user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  createUser,
  userLogin,
  getfileDetails
};
