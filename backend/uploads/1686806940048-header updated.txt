import {
  withStyles,
  AppBar,
  Toolbar,
  MuiThemeProvider,
  Link,
  Typography,
  Menu,
  MenuItem,
  Button,
  Divider,
} from "@material-ui/core";
import HeaderStyles from "../styles/HeaderStyles";
import { translate } from "../../assets/localisation";
import Theme from "../theme/theme-default";
import Avatar from "@material-ui/core/Avatar";
import bhashiniLogo from "../../assets/Bhashini_en.svg";

import { useHistory } from "react-router-dom";
import DownIcon from "@material-ui/icons/ArrowDropDown";
import { useState } from "react";
import DataDaan from "../../assets/DataDaan.png";
import AlertDialog from "../container/UploadData/Term&ConditionModal";
import UploadData from "../container/UploadData";

const StyledMenu = withStyles({
  paper: {
    "@media (max-width:650px)": {
      width: "120px",
    },
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

const Header = (props) => {
  const { classes } = props;
  const [logout, setAnchorElLogout] = useState(null);
  const [username] = useState("");
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [showUploader] = useState(false);
  const [disablebtn, setDisablebtn] = useState(false);

  const handleClose = () => {
    setAnchorElLogout(null);
  };

  const handleLogoutOption = (e) => {
    setAnchorElLogout(e.currentTarget);
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // useEffect(() => {
  //   setUsername("Anamika");
  // }, []);

  const handleMenuTypeClick = (value) => {
    if (value === "contribution") {
      history.push(`/datadaan/my-contribution`);
      setDisablebtn(false);
    } else if (value === "upload") {
      history.push(`/datadaan/upload-data`);
      setShowModal(!showModal);
    }
  };

  return (
    <MuiThemeProvider theme={Theme}>
      <AppBar color="inherit" position="static">
        <Toolbar className={classes.toolbar}>
          <Link href="https://bhashini.gov.in/en/">
            <img
              className={classes.bhashiniLogo}
              src={bhashiniLogo}
              alt="Bhashini Logo"
            />
          </Link>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            className={classes.logoDivider}
          />
          <Link href="https://bhashini.gov.in/bhashadaan/">
            <img
              className={`${classes.DataDaanLogo} ${classes.bhashiniLogo}`}
              src={DataDaan}
              alt="DataDaan Logo"
            />
          </Link>
          {/* <a><span style={{fontWeight:'bolder',fontSize:'1.75rem'}}>Data</span><span style={{fontWeight:'bolder',color:'#ffcc35',marginLeft: "3px",fontSize:'1.75rem'}}>Daan</span></a> */}
          {/* <Typography variant="h4">{translate("label.dmuDataDaan")}</Typography> */}
          {/* <img
                className={classes.bhashiniLogo}
                src={DatadaanLogo}
                alt="Datadaan Logo"
              /> */}

          <div
            style={{
              background: window.location.pathname.includes("my-contribution")
                ? "#f5f5f5"
                : "",
              marginRight: "20px",
            }}
          >
            {/* <Link to="/datadaan/my-contribution"> */}
            <Button
              className={classes.menuBtn}
              onClick={(e) => handleMenuTypeClick("contribution")}
              variant="text"
            >
              My Contribution
            </Button>
            {/* </Link> */}
          </div>

          <div>
            <div
              className={classes.model}
              style={
                window.location.pathname.includes("upload-data")
                  ? { background: "#f5f5f5" }
                  : {}
              }
            >
              <Button
                className={classes.menuBtn}
                variant="text"
                // onClick={(e) => handleMenuTypeClick("upload")}
                onClick={() => {
                  setDisablebtn(true);
                  setShowModal(!showModal);
                }}
                disabled={disablebtn === true}
              >
                Upload
              </Button>
            </div>
          </div>

          {showModal && (
            <AlertDialog
              hide={setDisablebtn}
              onClose={setShowModal}
              handleMenuTypeClick={handleMenuTypeClick}
            />
          )}

          <div className={classes.profile}>
            <Button
              onClick={(e) => handleLogoutOption(e)}
              className={classes.menuBtn}
            >
              <Avatar className={classes.avatar} variant="contained">
                {username.charAt(0)}
              </Avatar>
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.profileName}
              >
                {/* {username} */}
                {/* Anamika */}
                {userInfo.user[0].email}
              </Typography>
              <DownIcon color="action" />
            </Button>
            <StyledMenu
              id="data-set"
              anchorEl={logout}
              open={Boolean(logout)}
              onClose={(e) => handleClose(e)}
              className={classes.styledMenu1}
            >
              <MenuItem
                className={classes.styledMenu}
                onClick={() => {
                  localStorage.clear();
                  history.push(`${process.env.PUBLIC_URL}`);
                }}
              >
                {translate("label.logOut")}
              </MenuItem>
            </StyledMenu>
          </div>
        </Toolbar>
      </AppBar>
      {showUploader && <UploadData />}
    </MuiThemeProvider>
  );
};

export default withStyles(HeaderStyles)(Header);
