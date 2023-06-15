import { Box, Button, Divider, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { useState } from "react";
import FileUpload from "../../components/FileUpload";
import GlobalStyles from "../../styles/Styles";
import { useHistory } from "react-router-dom";
import Snackbar from "../../components/Snackbar";
import LinearIndeterminate from "../../components/LinearProgress";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import { textFields } from "../../../utils/utils";
import { useFormik } from "formik";
import { RegisterSchema } from "../../schemas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

const UploadData = (props) => {
  const { errors, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      console.log("errors", errors);
      console.log("Formik", values);
    },
  });
  // console.log("errors", errors);
  const { classes, setID } = props;
  const [meta, setMeta] = useState([]);
  const [zip, setZip] = useState([]);
  const [loading] = useState(false);
  const history = useHistory();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [tAndCData] = useState({});
  const [modal, setModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [userDetails, setUserDetails] = useState({
    organizationName: "",
    officerName: "",
    designation: "",
    emailId: "",
    contactNumber: "",
  });

  const handleClose = () => {
    history.push(`${process.env.PUBLIC_URL}/datadaan/my-contribution`);
    setModal(false);
  };

  const handleAgree = (
    permission,
    termsAndConditions,
    additionalDetails,
    acceptance
  ) => {
    localStorage.setItem(
      "acceptedTnC",
      JSON.stringify({
        permission,
        termsAndConditions,
        additionalDetails,
        acceptance,
      })
    );
    setModal(false);
  };

  const handleCheckboxChange = (event) => {
    setCheckbox(event.target.checked);
  };

  const handleCancel = () => {
    history.push(`${process.env.PUBLIC_URL}/datadaan/my-contribution`);
  };

  const handleSnackbarClose = () => {
    setSnackbarInfo({ ...snackbar, open: false });
  };

  const handleMetaFileChange = (files) => {
    setMeta(files);
  };

  const handleZipFileChange = (files) => {
    setZip(files);
  };

  const deletZipFile = () => {
    setZip([]);
  };

  const deleteMetaFile = () => {
    setMeta([]);
  };

  const clearFiles = () => {
    deleteMetaFile();
    deletZipFile();
  };

  const handleClearAll = () => {
    setMeta([]);
    setZip([]);
    setUserDetails({
      organizationName: "",
      officerName: "",
      designation: "",
      emailId: "",
      contactNumber: "",
    });
  };

  // let flag= false
  const handleSubmitUpload = async (event) => {
    toast.success("Submitted succesfully , visit My contribution", {
      position: "top-center",
    });

    event.preventDefault();

    console.log("checkkkkk");
    console.log(meta, zip, "check meta data");
    const formData = new FormData();
    formData.append("file", zip[0]);
    formData.append("readmeText", meta[0]);
    formData.append("organizationName", userDetails?.organizationName);
    formData.append("officerName", userDetails?.officerName);
    formData.append("designation", userDetails?.designation);
    formData.append("emailId", userDetails?.emailId);
    formData.append("contactNumber", userDetails?.contactNumber);

    console.log(formData);

    if (
      userDetails.organizationName === "" ||
      userDetails.officerName === "" ||
      userDetails.designation === "" ||
      userDetails.emailId === "" ||
      userDetails.contactNumber === ""
    ) {
      alert("Fields are empty");
    } else if (
      userDetails.contactNumber.length > 10 ||
      userDetails.contactNumber.length < 10
    ) {
      alert("Phone number is invalid, type 10 digit no.");
    } else {
      await fetch("http://localhost:4500/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())

        .then((data) => {
          console.log(data);
          setID(data[0]._id);
          // flag=true
        })
        .then(() => {
          toast.success("Submitted succesfully", {
            position: "top-center",
          });
          console.log("checkkkkk");
        })

        .catch((error) => {
          console.error(error);
        });
    }

    // if(flag){

    // }
  };

  return (
    <>
      {loading && <LinearIndeterminate />}
      <Box className={classes.flexBox}>
        <Box className={classes.parentBox}>
          <Box
            style={{
              alignSelf: "center",
            }}
          >
            <Typography>Best practices for submitting the files</Typography>
            <ul>
              <li className={classes.listStyle}>
                Make sure the names of text file and zip files are
                <strong>same</strong>.
              </li>
              <li className={classes.listStyle}>
                Max supported zip file size is <strong>5 GB</strong>.
              </li>
              <li className={classes.listStyle}>
                The README file should also contain metadata that specifies the
                <strong>directory structure</strong> of the zipped file.
              </li>
            </ul>
          </Box>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box style={{ width: "80%" }}>
            <Box className={`${classes.parentBox} ${classes.innerBox}`}>
              <Typography style={{ marginRight: "auto" }}>
                README.txt
              </Typography>
              <FileUpload
                acceptedFiles={[".txt"]}
                handleFileChange={handleMetaFileChange}
                handleFileDelete={clearFiles}
                label={meta.length > 0 ? meta[0].name : ""}
                style={{ width: "65%" }}
              />
            </Box>
            <Box
              className={`${classes.parentBox}  ${classes.innerBox}`}
              style={{
                marginTop: "35px",
              }}
            >
              <Typography style={{ marginRight: "auto" }}>
                Media Files zip
              </Typography>
              <FileUpload
                acceptedFiles={[".zip"]}
                handleFileChange={handleZipFileChange}
                handleFileDelete={clearFiles}
                label={zip.length > 0 ? zip[0].name : ""}
                style={{ width: "65%" }}
              />
            </Box>
            {/* {/ <input type="file" onChange={handleFileChange}/> /} */}

            {textFields.map((item, index) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Box
                    className={`${classes.parentBox}  ${classes.innerBox}`}
                    style={{ marginTop: "35px" }}
                    key={index}
                  >
                    <Typography style={{ marginRight: "auto", width: "30%" }}>
                      {item.label}*
                    </Typography>

                    <TextField
                      fullWidth
                      color="primary"
                      style={{ width: "70%" }}
                      label={"Enter here"}
                      name={item.name}
                      type={item.type}
                      value={userDetails[item.name]}
                      // onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      onChange={(event) =>
                        setUserDetails((prev) => ({
                          ...prev,
                          [event.target.name]: event.target.value,
                        }))
                      }
                    />
                  </Box>
                </form>
              );
            })}

            <Box style={{ display: "flex" }}>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                onClick={handleClearAll}
                className={classes.submitBtn}
                style={{ width: "25%" }}
              >
                Clear All
              </Button>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSubmitUpload}
                className={classes.submitBtn}
                // disabled={disableSubmit()}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          handleClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          message={snackbar.message}
          variant={snackbar.variant}
        />
      )}

      {modal && (
        <TermsAndConditionsModal
          open={modal}
          isChecked={checkbox}
          toggleCheckbox={handleCheckboxChange}
          handleClose={handleClose}
          handleAgree={handleAgree}
          handleCancel={handleCancel}
          data={tAndCData}
        />
      )}
    </>
  );
};

export default withStyles(GlobalStyles)(UploadData);
