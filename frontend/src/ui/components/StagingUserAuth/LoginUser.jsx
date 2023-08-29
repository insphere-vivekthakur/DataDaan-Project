import React, { useState } from "react";
import "./login.css";
import axios from "axios";

const LoginUser = ({ handler }) => {
  const [getUserEmail, setUserEmail] = useState("");
  const [getUserPassword, setUserPassword] = useState("");

  const handleUserLogin = () => {
    // handler({"isSucsess":true})
    if (getUserEmail.length > 0 && getUserPassword.length) {
      try {
        axios({
          method: "post",
          url: "https://bhashini-datadaan-backend-webapp.azurewebsites.net/userAuthLogin",
          data: {
            email: getUserEmail,
            password: getUserPassword,
          },
        })
          .then((data) => {
            data.data.success
              ? handler({ isSucsess: true })
              : handler({ isSucsess: false });
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
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
              placeholder="Username"
              value={getUserEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            ></input>
          </div>

          <div id="pass">
            <input
              className="u-field"
              type="password"
              name="password"
              placeholder="Password"
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
    </div>
  );
};

export default LoginUser;
