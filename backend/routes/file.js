const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../models/file");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
var multerAzure = require('multer-azure');
const { error } = require("console");
// const fileInfo=require("../utils/file-info.js");
var request = require("request");
// const { v4: uuidv4 } = require('uuid');

// let organization=uuidv4();
let organization = Math.random().toString().replace(/0\./, '');

const azureStorageConfig = multerAzure({
  connectionString: process.env.AZURE_CONNECTION_STRING, //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
  account: process.env.AZURE_STORAGE_RESOURCE_NAME, //The name of the Azure storage account
  key: process.env.AZURE_STORAGE_KEY, //A key listed under Access keys in the storage account pane
  container: process.env.AZURE_STORAGE_RESOURCE_NAME,  //Any container name, it will be created if it doesn't exist
  blobPathResolver: (_req, file, callback) => {
    // let path;
    // if (_req.body.folderPath) {
    //   path = `${organization}/${_req.body.folderPath}/${file.originalname}`
    // } else {
    //   path = `${organization}/${file.originalname}`;
    // }
    const path = `$${_req.body.folderPath}/${file.originalname}`
    // console.log(path, "path");
    callback(null, path);
  }
})

let upload = multer({
  storage: azureStorageConfig
})


function getFileInfo(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      // in addition to parsing the value, deal with possible errors
      if (error) return reject(error);
      try {
        // JSON.parse() can throw an exception if not valid JSON
        resolve(response.headers["content-length"]);
      } catch (e) {
        reject(e);
      }
    });
  });
}

function getFileSizeInKb(byte){
  return (byte/1024).toFixed(2)+"Kb";
}


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
    // console.log(req.files);
    try {
      const {
        submittedBy,
        organizationName,
        designatedOfficerName,
        designation,
        emailId,
        contactNumber,
        folderPath
      } = req.body;
      // console.log(req);



      // let fileDataSize;
      // request({
      //   url: req.files[0].fieldname === 'file' ? req.files[0].url : req.files[1].url,
      //   method: "HEAD"
      // }, function (err, response, body) {
      //   console.log(response.headers["content-length"]);
      //   //fileData.fileSize=response.headers["content-length"];
      //   fileDataSize = response.headers["content-length"];
      //   return;
      //   // console.log(err);
      //   // let dataaa=fileInfo(fileData.dataFileUrl);
      //   // console.log(body);
      //   // process.exit(0);
      // });

      getFileInfo(req.files[0].fieldname === 'file' ? req.files[0].url : req.files[1].url).then(fileSize=>{
        const newFile = new File({
          dataFile: req.files[0].fieldname === 'file' ? req.files[0].originalname : req.files[1].originalname,
          dataFileUrl: req.files[0].fieldname === 'file' ? req.files[0].url : req.files[1].url,
          readmeText: req.files[0].fieldname === 'readmeText' ? req.files[0].originalname : req.files[1].originalname,
          readmeTextUrl: req.files[0].fieldname === 'readmeText' ? req.files[0].url : req.files[1].url,
          folderName: req.files[0].blobPath.split("/")[0],
          submittedBy,
          organizationName,
          designatedOfficerName,
          designation,
          emailId,
          contactNumber,
          fileSize: getFileSizeInKb(fileSize)
        });
        return newFile.save();
        
      }).then(data=>{
        res.status(200).send({
          code: 200,
          message: "upload success",
          data: data
        })
      }).catch(function (err) {
        console.err(err);
      });




      

      // console.log(newFile);

      // let fileData = await newFile.save();
      // // console.log(fileData);
      // res.status(200).send({
      //   code: 200,
      //   message: "upload success",
      //   data: fileData
      // });
    } catch (err) {
      // console.log("error", error);
      // await unlinkAsync(req.file.path);
      res.status(400).send({ succes: false, msg: err.message });
    }
  }
);

module.exports = router;
