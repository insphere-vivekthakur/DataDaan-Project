import {
  
  Switch,
  Route,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import history from "./web.history";
import Layout from "./ui/Layout";
import authenticateUser from "./configs/authenticate";
import Login from "./ui/container/UserManagement";
import UploadData from "./ui/container/UploadData";
import MyContribution from "./ui/container/MyContribution";

import { useState } from "react";

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
        console.log(rest, "rest");
        console.log(props, "props");
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
  const [ID, setID]= useState("")
  console.log("ID Check", ID);
  return (
    <BrowserRouter history={history} basename="/">
      <Switch>
        <Route exact path="/" component={Login} />
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
          component={(props)=><UploadData {...props} setID={setID}/>}
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
  );
}
