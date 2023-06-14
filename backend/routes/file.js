const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../models/file");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
});

const upload = multer({ storage: storage });

//Upload file

router.post(
  "/upload",
  upload.fields([
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
    try {
      const {
        ID,
        organizationName,
        officerName,
        designation,
        emailId,
        contactNumber,
        isIndividual,
      } = req.body;

      const files = [];

      if (req.files.file) {
        const newFile = new File({
          path: req.files.file[0].path,
          mediaFile: req.files.file[0].originalname,
          ID,
          organizationName,
          officerName,
          designation,
          emailId,
          contactNumber,
          isIndividual,
        });
        newFile.readmeText = req.files.readmeText[0].filename;
        const file = await File.addFile(newFile);
        files.push(file);
      }

      res.send(files);
    } catch (err) {
      await unlinkAsync(req.file.path);
      res.status(400).send({ succes: false, msg: err.message });
    }
  }
);

module.exports = router;
