const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  // path: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
 isIndividual:{
  type: Number,
  required: false,
 },
  mediaFile: {
    type: String,
    required: true,
  },
  readmeText: {
    type: String,
    required: true,
  },
  organizationName:{
    type: String, 
    required: [true, 'OrganizationName is required'] 
  
  },

  officerName:{
    type: String, 
    required: [true, 'officerName is required']
  },
  designation:{
    type: String, 
    required: [true, 'designation is required']
  },
  emailId: {
    type: String,
    required: [true, 'Email is required'], 
    validate: {
      validator: function (email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
      },
      message: 'Invalid email format'
    }
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'], 
    validate: {
      validator: function (contactNumber) {
        const contactNumberRegex = /^\d{10}$/;
        return contactNumberRegex.test(contactNumber);
      },
      message: 'Invalid contact number format'
    }
  },
timestamp: {
    type: Date,
    default: Date.now,
  },
});
const File = (module.exports = mongoose.model("File", fileSchema));

module.exports.addFile = async function (file) {
  return File.create(file);
};
