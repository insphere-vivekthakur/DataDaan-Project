// const organizationDetail = require("../models/Organisation");
const FIRModel = require("../models/bhashiniPOC/bhashiniPOC.js");
const File = require("../models/file");
const User = require("../models/User");
const UserAuth = require("../models/userAuthForAllProjects/UserAuth");
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

    let isUser = await User.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    }).exec();
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
        await User.findByIdAndUpdate(result._id, {
          token: getToken(result._id),
        });
        const updatedData = await User.findById(result._id).exec();
        return res.status(200).send({
          code: 200,
          message: "Register Success",
          status: "success",
          data: updatedData,
        });
      } else {
        return res.status(400).send({
          code: 400,
          message: "something went wrong",
          status: "failed",
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
              _id: userData._id,
              firstname: userData.firstname,
              lastname: userData.lastname,
              email: userData.email,
              // password: userData.password,
              mobile: userData.mobile,
              address1: userData.address1,
              address2: userData.address2,
              address3: userData.address3,
              city: userData.city,
              landmark: userData.landmark,
              pincode: userData.pincode,
              token: userData.token,
            };
            const response = {
              success: true,
              msg: "Login successfull",
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
};

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
};

const userAuthLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await UserAuth.findOne({ email: email });
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
              _id: userData._id,
              email: userData.email,
              password: userData.password,
            };
            const response = {
              success: true,
              msg: "login successfull",
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
const userAuthRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    let isUser = await UserAuth.findOne({ $or: [{ email: email }] }).exec();
    if (isUser && isUser !== null) {
      return res.status(400).send({
        code: 400,
        message: "email already exist",
        data: {},
      });
    } else {
      // console.log(isUser, 'user doesnot exist');
      const spassword = await securePassword(password);

      const userData = new UserAuth({
        email: email,
        password: spassword,
      });

      let result = await userData.save();
      if (result) {
        await UserAuth.findByIdAndUpdate(result._id, {
          token: getToken(result._id),
        });
        const updatedData = await UserAuth.findById(result._id).exec();
        return res.status(200).send({
          code: 200,
          message: "Register Success",
          status: "success",
          data: updatedData,
        });
      } else {
        return res.status(400).send({
          code: 400,
          message: "something went wrong",
          status: "failed",
          data: {},
        });
      }
    }
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ status: 500, message: errorMessage });
  }
};
const userAuthPassUpdate = async (req, res) => {
  try {
    const { email, password } = req.body;

    let isUser = await UserAuth.findOne({ $or: [{ email: email }] }).exec();
    if (isUser && isUser !== null) {
      // console.log(isUser, 'user doesnot exist');
      const spassword = await securePassword(password);

      UserAuth.findOneAndUpdate({ email: email }, { password: spassword })
        .then((data) => {
          const response = {
            success: true,
            msg: "Password Update Successfully.",
          };
          res.status(200).send(response);
        })
        .catch((err) => {
          return res.status(400).send({
            code: 400,
            message: "Not a valid user",
            status: "failed",
            data: err,
          });
        });
    } else {
      return res.status(400).send({
        code: 400,
        message: "Not a valid user",
        status: "failed",
        data: {},
      });
    }
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ status: 500, message: errorMessage });
  }
};
const userAuthDelete = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await UserAuth.findOne({ email: email });
    if (userData) {
      // const passwordMatch = bcrypt.compare(password,userData.password).then(item=>{
      //   return item
      // });
      bcrypt.compare(password, userData.password, function (err, success) {
        if (err) {
          console.log(err);
        } else {
          if (success) {

            UserAuth.findByIdAndRemove(userData._id)
              .then((data) => {
                const response = {
                  success: true,
                  msg: "User Deleted Successfully."
                };
                res.status(200).send(response);
              })
              .catch((err) => {
                res
                  .status(200)
                  .send({ success: false, msg: "Something happens wrong" });
              });
          } else {
            res
              .status(200)
              .send({ success: false, msg: "Something happens wrong" });
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

const updateUserFileInfo = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await UserAuth.findOne({ email: email });
    if (userData) {
      // const passwordMatch = bcrypt.compare(password,userData.password).then(item=>{
      //   return item
      // });
      bcrypt.compare(password, userData.password, function (err, success) {
        if (err) {
          console.log(err);
        } else {
          if (success) {

            UserAuth.findByIdAndRemove(userData._id)
              .then((data) => {
                const response = {
                  success: true,
                  msg: "User Deleted Successfully."
                };
                res.status(200).send(response);
              })
              .catch((err) => {
                res
                  .status(200)
                  .send({ success: false, msg: "Something happens wrong" });
              });
          } else {
            res
              .status(200)
              .send({ success: false, msg: "Something happens wrong" });
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


// ============================================================================================================= //
//DUMMY APIS FOR BHASHINI POC//                                                   
// ============================================================================================================= //

const feedFIRdata = async (req, res) => {
  const sampleData = [
    {
      "firNumber": "FIR12345",
      "serialNumber": "SN6789",
      "complaintName": "John Doe",
      "firDetails": {
        "description": "A report filed against an unknown suspect for a theft incident.",
        "summary": "The complainant, John Doe, has reported an incident of theft that occurred at his residence. The unknown suspect entered the premises and stole valuable items. The complainant noticed the incident on the evening of November 23, 2023.",
        "additionalDetails": "The incident took place at 123 Main St, Cityville. John Doe immediately contacted the police to report the theft. The suspect is described as tall and was wearing dark clothes. The police have collected statements from witnesses and are actively investigating the case."
      },
      "firPlace": "123 Main St, Cityville",
      "firTime": "2023-11-23T18:45:00Z",
      "policeStation": {
        "name": "Cityville Police Station",
        "officerName": "Officer Smith",
        "badgeNumber": "12345"
      },
      "complainantContact": {
        "name": "John Doe",
        "contactNumber": "9876543210",
        "address": "123 Main St, Cityville"
      },
      "status": "Pending"
    },
    {
      "firNumber": "FIR67890",
      "serialNumber": "SN5432",
      "complaintName": "Alice Johnson",
      "firDetails": {
        "description": "Filing a report against a burglary incident at a commercial establishment.",
        "summary": "The complainant, Alice Johnson, reported a burglary incident at her shop. The incident occurred during the night of December 2, 2023. Valuable goods and cash were stolen.",
        "additionalDetails": "The shop, located at 456 Market St, Townsville, was found broken into in the morning. Alice immediately reported the incident to the local police, providing details about the stolen items. The police are conducting an investigation with the available CCTV footage."
      },
      "firPlace": "456 Market St, Townsville",
      "firTime": "2023-12-02T05:30:00Z",
      "policeStation": {
        "name": "Townsville Police Station",
        "officerName": "Officer Johnson",
        "badgeNumber": "56789"
      },
      "complainantContact": {
        "name": "Alice Johnson",
        "contactNumber": "8765432109",
        "address": "456 Market St, Townsville"
      },
      "status": "Investigation Ongoing"
    },
    {
      "firNumber": "FIR12346",
      "serialNumber": "SN6790",
      "complaintName": "Alice Johnson",
      "firDetails": {
        "description": "Report of a missing person filed by Alice Johnson.",
        "summary": "Alice Johnson has reported that her brother, Bob Johnson, has been missing since November 25, 2023. He was last seen at their residence in Oak Street. The family is concerned and seeking police assistance to locate him.",
        "additionalDetails": "Bob Johnson is 30 years old, 6 feet tall, with brown hair and blue eyes. He was wearing a black jacket and jeans when he was last seen. The police are coordinating search efforts and gathering information from the community."
      },
      "firPlace": "456 Oak St, Townsville",
      "firTime": "2023-11-25T14:30:00Z",
      "policeStation": {
        "name": "Townsville Police Station",
        "officerName": "Officer Davis",
        "badgeNumber": "67890"
      },
      "complainantContact": {
        "name": "Alice Johnson",
        "contactNumber": "9876543211",
        "address": "456 Oak St, Townsville"
      },
      "status": "Open"
    }, {
      "firNumber": "FIR12347",
      "serialNumber": "SN6791",
      "complaintName": "Eva Williams",
      "firDetails": {
        "description": "Assault incident reported by Eva Williams against an unknown assailant.",
        "summary": "Eva Williams reported an assault incident that occurred near Elm Park on December 1, 2023. She was walking in the park when an unknown assailant approached her and physically assaulted her. Eva managed to escape and immediately reported the incident to the police.",
        "additionalDetails": "The incident took place around 8:00 PM near the park entrance. Eva Williams describes the assailant as a tall person wearing a hoodie and a mask. The police are reviewing surveillance footage and seeking information from potential witnesses."
      },
      "firPlace": "Elm Park, Riverdale",
      "firTime": "2023-12-01T20:00:00Z",
      "policeStation": {
        "name": "Riverdale Police Station",
        "officerName": "Officer Johnson",
        "badgeNumber": "67901"
      },
      "complainantContact": {
        "name": "Eva Williams",
        "contactNumber": "9876543212",
        "address": "789 Maple Ave, Riverdale"
      },
      "status": "Under Investigation"
    },
    {
      "firNumber": "FIR12347",
      "serialNumber": "SN6791",
      "complaintName": "Eleanor Smith",
      "firDetails": {
        "description": "Report of a vandalism incident filed by Eleanor Smith.",
        "summary": "Eleanor Smith has reported an incident of vandalism that occurred at her art studio on December 2, 2023. Unknown individuals defaced several paintings and damaged art supplies. Eleanor is seeking police assistance to investigate the incident.",
        "additionalDetails": "The art studio is located at 789 Art Avenue, Creativity City. The incident was discovered by Eleanor on the morning of December 2. The police are examining security footage and collecting evidence from the scene."
      },
      "firPlace": "789 Art Avenue, Creativity City",
      "firTime": "2023-12-02T09:00:00Z",
      "policeStation": {
        "name": "Creativity City Police Station",
        "officerName": "Officer Johnson",
        "badgeNumber": "67901"
      },
      "complainantContact": {
        "name": "Eleanor Smith",
        "contactNumber": "9876543212",
        "address": "789 Art Avenue, Creativity City"
      },
      "status": "Investigation Ongoing"
    },
    {
      "firNumber": "FIR12347",
      "serialNumber": "SN6791",
      "complaintName": "Robert Miller",
      "firDetails": {
        "description": "A report filed regarding a hit and run incident.",
        "summary": "Robert Miller has reported a hit and run incident that occurred on November 27, 2023. The complainant was crossing the street at the intersection of Pine Avenue and Elm Street when a vehicle struck him and fled the scene.",
        "additionalDetails": "The incident occurred at around 8:15 PM. The complainant sustained minor injuries and was taken to City General Hospital for medical attention. The police are reviewing surveillance footage from nearby cameras to identify the vehicle and driver."
      },
      "firPlace": "Intersection of Pine Avenue and Elm Street",
      "firTime": "2023-11-27T20:15:00Z",
      "policeStation": {
        "name": "City Central Police Station",
        "officerName": "Officer Johnson",
        "badgeNumber": "56789"
      },
      "complainantContact": {
        "name": "Robert Miller",
        "contactNumber": "9876543212",
        "address": "789 Elm St, City Central"
      },
      "status": "Investigation Ongoing"
    }
  ]


  let updatedData = sampleData.map((data, index) => {
    return {
      "firNumber": `FIR${(Math.floor(Math.random() * 90000) + 10000)}`,
      "serialNumber": `SN000${index + 1}`,
      "complaintName": "John Doe",
      "firDetails": {
        "description": data.firDetails.description,
        "summary": data.firDetails.summary,
        "additionalDetails": data.firDetails.additionalDetails
      },
      "firPlace": data.firPlace,
      "firTime": data.firTime,
      "policeStation": {
        "name": data.policeStation.name,
        "officerName": data.policeStation.officerName,
        "badgeNumber": data.policeStation.badgeNumber
      },
      "complainantContact": {
        "name": data.complainantContact.name,
        "contactNumber": data.complainantContact.contactNumber,
        "address": data.complainantContact.address
      },
      "status": data.status
    }
  })


  try {
    for (const item of updatedData) {
      const firData = new FIRModel(item);
      let result = await firData.save();
    }

    res.status(200).json({
      success: true,
      status: 'success',
      statusCode: 200,
      message: 'Data Initiated',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}


const searchFIR = async (req, res) => {
  try {
    const { firNumber } = req.params;

    // Find FIR by FIR number
    const foundFIR = await FIRModel.findOne({ firNumber });

    if (!foundFIR) {
      return res.status(404).json({
        success: false,
        status: 'error',
        statusCode: 404,
        message: 'FIR not found',
      });
    }

    res.status(200).json({
      success: true,
      status: 'success',
      statusCode: 200,
      message: 'FIR found successfully',
      data: foundFIR,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}


const getAllFIRNumbers = async (req, res) => {
  try {
    // Find all FIRs
    const allFIRs = await FIRModel.find();
    if (allFIRs.length > 0) {
      const updatedModelData = allFIRs.map(data => data.firNumber)
      res.status(200).json({
        success: true,
        status: 'success',
        statusCode: 200,
        message: 'FIRs retrieved successfully',
        data: updatedModelData,
      });

    } else {
      res.status(200).json({
        success: true,
        status: 'success',
        statusCode: 200,
        message: 'FIRs retrieved successfully',
        data: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

const updateFIRData = async (req, res) => {
  try {
    const { firNumber } = req.params;
    const { description, summary, additionalDetails, dataToUpdate } = req.body;

    // Find FIR by FIR number
    const foundFIR = await FIRModel.findOne({ firNumber });

    if (!foundFIR) {
      return res.status(404).json({
        success: false,
        status: 'error',
        statusCode: 404,
        message: 'FIR not found',
      });
    }

    // Update translatedData based on dataToUpdate
    switch (dataToUpdate) {
      case 'translate':
        foundFIR.translatedData = { description, summary, additionalDetails };
        break;
      case 'tts':
        foundFIR.ttsData = { description, summary, additionalDetails };
        break;
      case 'asr':
        foundFIR.asrData = { description, summary, additionalDetails };
        break;
      default:
        return res.status(400).json({
          success: false,
          status: 'error',
          statusCode: 400,
          message: 'Invalid dataToUpdate value',
        });
    }

    // Save the updated FIR data
    await foundFIR.save();

    return res.status(200).json({
      success: true,
      status: 'success',
      statusCode: 200,
      message: 'Translated data updated successfully',
      data: foundFIR,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
// ===============================================================================================================//


module.exports = {
  createUser,
  userLogin,
  getFileDetails,
  getUploadedData,
  userAuthDelete,
  userAuthPassUpdate,
  userAuthRegister,
  userAuthLogin,
  feedFIRdata,
  searchFIR,
  getAllFIRNumbers,
  updateFIRData
};
