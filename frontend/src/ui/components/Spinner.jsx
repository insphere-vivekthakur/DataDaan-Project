import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
  progress: {
    color: "#fff",
    width: "30px",
    display: "flex",
  },
  progressContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  progressDiv: {
    position: "fixed",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1200,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
  },
  pleaseWaitText: {
    color: "#fff",
    marginTop: "5px",
    fontSize: "16px",
    fontWeight: "lighter",
  },
});

function CircularIndeterminate(props) {
  const { classes } = props;
  return (
    <div className={classes.progressDiv}>
      <div className={classes.progressContainer}>
        <CircularProgress
          color="primary"
          size={50}
          className={classes.progress}
        />
        <span className={classes.pleaseWaitText}>
          Your data is uploading, Please wait...{" "}
        </span>
      </div>
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);
