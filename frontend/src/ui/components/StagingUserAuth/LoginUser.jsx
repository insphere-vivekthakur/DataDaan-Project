import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginUser = ({ handler }) => {
  const [getUserEmail, setUserEmail] = useState("");
  const [getUserPassword, setUserPassword] = useState("");

  const customId = "custom-id-yes";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleUserLogin = () => {
    if (getUserEmail.length === 0 && getUserPassword.length === 0) {
      toast.error("Both fields are mandatory", {
        position: "bottom-center",
        closeOnClick: true,
        autoClose: 1000,
        hideProgressBar: true,
        theme: "colored",
      });
    } else if (getUserEmail.length === 0) {
      toast.error("Email is mandatory", {
        position: "bottom-center",
        closeOnClick: true,
        toastId: customId,
        autoClose: 1000,
        hideProgressBar: true,
        theme: "colored",
      });
    } else if (!emailPattern.test(getUserEmail)) {
      //  emailPattern.test(getUserRemail) =>true
      toast.error("Enter valid email ", {
        position: "bottom-center",
        closeOnClick: true,
        toastId: customId,
        autoClose: 1000,
        hideProgressBar: true,
        theme: "colored",
      });
    } else if (getUserPassword.length === 0) {
      toast.error("Password is mandatory", {
        position: "bottom-center",
        closeOnClick: true,
        toastId: customId,
        autoClose: 1000,
        hideProgressBar: true,
        theme: "colored",
      });
    } else {
      try {
        axios({
          method: "post",
          url: "https://bhashini-datadaan-backend-webapp.azurewebsites.net/userAuthLogin",
          data: {
            email: getUserEmail,
            password: getUserPassword,
          },
        }).then((data) => {
          if (data.data.success) {
            handler({ isSucsess: true });
            // toast.success("Login Success", {
            //   position: "bottom-center",
            //   closeOnClick: true,
            //   autoClose: 1000,
            //   hideProgressBar: true,
            //   theme: "colored",
            //   toastId: customId,
            // });
          } else {
            toast.error(
              // `${data.data.msg}`
              "Invalid user details",

              {
                position: "bottom-center",
                closeOnClick: true,
                toastId: customId,
                autoClose: 1000,
                hideProgressBar: true,
                theme: "colored",
              }
            );
            handler({ isSucsess: false });
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div id="login-form">
        <div id="login-head">
          <h1>Welcome Back!</h1>
          <h2>Please Enter your details to see the page</h2>
        </div>
        <div id="login-details">
          <div id="user">
            <input
              className="u-field"
              type="text"
              name="name"
              placeholder="Username*"
              value={getUserEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            ></input>
          </div>

          <div id="pass">
            <input
              className="u-field"
              type="password"
              name="password"
              placeholder="Password*"
              value={getUserPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            ></input>
          </div>

          <div id="submit">
            <input
              className="loginbtn"
              type="submit"
              value="Login"
              onClick={handleUserLogin}
            ></input>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginUser;
