import {
  Switch,
  Route,
  Redirect,
  BrowserRouter,
  useHistory,
} from "react-router-dom";

// import { useHistory } from "react-router-dom";
// import { useLocation } from "react-router-dom";

import history from "./web.history";
import Layout from "./ui/Layout";
import authenticateUser from "./configs/authenticate";
import Login from "./ui/container/UserManagement";
import UploadData from "./ui/container/UploadData";
import MyContribution from "./ui/container/MyContribution";

import { useState, useEffect } from "react";
import LoginUser from "./ui/components/StagingUserAuth/LoginUser";
import { useLocation } from "react-router-dom";

const PrivateRoute = ({
  path,
  component: Component,
  authenticate,
  title,
  token,
  type,
  index,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        // console.log(rest, "rest");
        // console.log(props, "props");
        return authenticate() ? (
          <Layout component={Component} type={type} index={index} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: `${process.env.PUBLIC_URL}/datadaan/user-login`,
              from: props.location.pathname,
            }}
          />
        );
      }}
    />
  );
};

export default function App() {
  const [ID, setID] = useState("");
  const history = useHistory();
  const location = useLocation();
  const [authenticatedState, setAuthenticatedState] = useState(true);
  /* Generic code changes start */
  const checkAuthenticatedKeyWord = localStorage.getItem("isAuthenticated");
  const getDomain = window.location.host;
  console.log("get Domain", getDomain);
  if (checkAuthenticatedKeyWord === null) {
    localStorage.setItem("isAuthenticated", false);
  }
  const loginClickHandler = (userInfo) => {
    console.log(userInfo);
    if (userInfo.isSucsess) {
      localStorage.setItem("isAuthenticated", true);
      history.push("/");
      setAuthenticatedState(false);
    }
  };
  useEffect(() => {
    if (
      getDomain !== "www.datadaan.bhashini.gov.in" ||
      "datadaan.bhashini.gov.in"
    ) {
      console.log(JSON.parse(localStorage.getItem("isAuthenticated")));
      if (JSON.parse(localStorage.getItem("isAuthenticated")) === false) {
        if (authenticatedState) {
          history.push("/login");
        }
      } else {
        history.push("/");
        setAuthenticatedState(false);
      }
    } else {
      history.push("/");
      setAuthenticatedState(false);
    }
  }, [authenticatedState]);
  /* Generic code changes end */
  // useEffect(() => {
  //   SITE_TITLE_BUILDER(location.pathname);
  // }, [location]);
  // console.log("ID Check", ID);
  return (
    <div id="topHeader">
      {authenticatedState ? (
        <LoginUser handler={loginClickHandler} />
      ) : (
        <>
          <BrowserRouter history={history} basename="/">
            <Switch>
              <Route exact path="/" component={Login} />

              {/* <Route exact path="/newlogin" component={NewLogin} /> */}
              {/* <Route exact path="/" component={MyContribution} /> */}
              <Route
                exact
                path={`${process.env.PUBLIC_URL}/datadaan/user-login`}
                component={Login}
              />
              <PrivateRoute
                path={`/datadaan/upload-data`}
                title={"Upload Data"}
                authenticate={authenticateUser}
                component={(props) => <UploadData {...props} setID={setID} />}
                currentMenu="upload-data"
                dontShowHeader={false}
                type={"dataset"}
                index={0}
              />

              <PrivateRoute
                path={`/datadaan/my-contribution`}
                title={"My Contribution"}
                authenticate={authenticateUser}
                // component={MyContribution}
                component={(props) => <MyContribution {...props} ID={ID} />}
                currentMenu="my-contribution"
                dontShowHeader={false}
                type={"dataset"}
                index={0}
              />
            </Switch>
          </BrowserRouter>
        </>
      )}
    </div>
  );
}
