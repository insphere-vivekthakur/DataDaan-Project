const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../models/file");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
var multerAzure = require('multer-azure');
const { error } = require("console");
let isBlobNameUpdate = false;
// const { v4: uuidv4 } = require('uuid');

// let organization=uuidv4();

let organization = Math.random().toString().replace(/0\./, '');

const getBlobName = (isUpdate) => {
  if (isUpdate) {
    return Math.random().toString().replace(/0\./, '');
  } else {
    return organization;
  }
}

// console.log(getBlobName(true), "getBlobName(true)");
// console.log(getBlobName(false), "getBlobName(false)");
// console.log(organization, "organization");

// let organization = Math.random().toString().replace(/0\./, '');

const azureStorageConfig = multerAzure({
  connectionString: process.env.AZURE_CONNECTION_STRING, //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
  account: process.env.AZURE_STORAGE_RESOURCE_NAME, //The name of the Azure storage account
  key: process.env.AZURE_STORAGE_KEY, //A key listed under Access keys in the storage account pane
  container: process.env.AZURE_STORAGE_RESOURCE_NAME,  //Any container name, it will be created if it doesn't exist
  blobPathResolver: (_req, file, callback) => {
    let path;
    if (_req.body.pathToFile) {
      path = `${getBlobName(isBlobNameUpdate)}/${_req.body.pathToFile}/${file.originalname}`
    } else {
      path = `${getBlobName(isBlobNameUpdate)}/${file.originalname}`;
    }
    console.log(path, "path");
    callback(null, path);
  }
})

var upload = multer({
  storage: azureStorageConfig
})



router.post(
  "/upload",
  upload.any([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "readmeText",
      maxCount: 1,
    },
  ]),
  async function (req, res, next) {
    // console.log(req);
    // console.log(req);
    try {
      const {
        submittedBy,
        organizationName,
        designatedOfficerName,
        designation,
        emailId,
        contactNumber
      } = req.body;
      // console.log(req.files);
      const newFile = new File({
        dataFile: req.files[0].fieldname === 'file' ? req.files[0].originalname : req.files[1].originalname,
        dataFileUrl: req.files[0].fieldname === 'file' ? req.files[0].url : req.files[1].url,
        readmeText: req.files[0].fieldname === 'readmeText' ? req.files[0].originalname : req.files[1].originalname,
        readmeTextUrl: req.files[0].fieldname === 'file' ? req.files[0].url : req.files[1].url,
        folderName: req.files[0].blobPath.split("/")[0],
        submittedBy,
        organizationName,
        designatedOfficerName,
        designation,
        emailId,
        contactNumber
      });
      let fileData = await newFile.save();
      isBlobNameUpdate = true;
      // console.log(fileData);
      res.status(200).send({
        code: 200,
        message: "upload success",
        data: fileData
      });
    } catch (err) {
      // console.log("error", error);
      // await unlinkAsync(req.file.path);
      res.status(400).send({ succes: false, msg: err.message });
    }
  }
);

module.exports = router;
