const organizationDetail = require("../models/Organisation");
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

const getToken = (userId) =>
  JWT.createtoken({ _id: userId }, process.env.TOKEN_SECRET);

const createUser = async (req, res) => {
  
  const {
    name,
    email,
     password,
    phone,
    permanentAddress,
    communicationAddress,
    userDetail,
  } = req.body;
  console.log(req.body)
  const spassword = await securePassword(password);

  const organization = new organizationDetail({
    name,
    email,
    password:spassword,
    phone,
    permanentAddress,
    communicationAddress,
  });
  organization.token = getToken(organization._id)
  console.log(organization)

  const users = [];
  for (const user of userDetail) {
    const data = new User({
      firstname:user.firstname,
      lastname:user.lastname,
      email:user.email,
      mobile:user.mobile,
      phone:user.phone,
      organization: organization._id,
    });
    data.token = getToken(data._id)
    users.push(data);
    console.log(users)
  }

  organization.users = users.map((user) => user._id);
  
  Promise.all([organization.save(), ...users.map((user) => user.save())])
    .then(() => {
      console.log("Organization and users saved successfully");
      res.status(201).json({"success":"true","organization":organization,"users":users});
    })
    .catch((err) => {
      console.error("Error saving organization and users:", err);
      res
        .status(500)
        .json({ error: "this email is already exists" });
    });
};


////////Login 

const userLogin = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;

  const user = await User.aggregate(
   [
   
    {$lookup:{from:"organisationdetails",localField:"organization",foreignField:"_id",as:"organizationObj" }},
    {$unwind:{path:"$organizationObj"}},
    {$match:{$or:[{"email":email},{"organizationObj.email":email}]}},
    // {$project:{"document": "$$ROOT","organizationObj":1}},
    

   ]
  )
  console.log(user)

  if(!user||!user.length){
    return res.json({"response":"user not found"})
  }

  console.log(user)
 const data =await passwordMatch(password,user[0].organizationObj.password)
 if(data){
  delete user[0].organizationObj.password
  delete user[0].password
  return res.json({"response":"login succesfull",user:user})
 }
 else{
  return res.json({"response":"login incorrect"})
 }

};

///
const getfileDetails= async (req, res) => {
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
