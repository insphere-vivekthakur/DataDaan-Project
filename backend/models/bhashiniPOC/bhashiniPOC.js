const mongoose = require('mongoose');

const firSchema = new mongoose.Schema({
  firNumber: {
    type: String,
  },
  serialNumber: {
    type: String,
  },
  complaintName: {
    type: String,
  },
  firDetails: {
    description: String,
    summary: String,
    additionalDetails: String,
  },
  firPlace: {
    type: String,
  },
  firTime: {
    type: Date,
  },
  policeStation: {
    name: String,
    officerName: String,
    badgeNumber: String,
  },
  complainantContact: {
    name: String,
    contactNumber: String,
    address: String,
  },
  status: {
    type: String,
  },
  translatedData: {
    description: {
        type:String,
        default:""
    },
    summary: {
        type:String,
        default:""
    },
    additionalDetails:{
        type:String,
        default:""
    },
  },
  ttsData: {
    description: {
        type:String,
        default:""
    },
    summary: {
        type:String,
        default:""
    },
    additionalDetails: {
        type:String,
        default:""
    },
  },
  asrData: {
    description: {
        type:String,
        default:""
    },
    summary: {
        type:String,
        default:""
    },
    additionalDetails: {
        type:String,
        default:""
    },
  },
});

const FIRModel = mongoose.model('FIR', firSchema);

module.exports = FIRModel;
