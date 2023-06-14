import React from "react";
import Theme from "./theme/theme-default";
import { withStyles } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import GlobalStyles from "./styles/Styles";
import Header from "./components/Header";


function App(props) {
  const Component = props.component;
  const { classes } = props;

  return (
    <MuiThemeProvider theme={Theme}>
      <div className={classes.root}>
        <Header />
        <div className={classes.container}>
          <Component />
        </div>
      </div>
    </MuiThemeProvider>
  );
}
export default withStyles(GlobalStyles(Theme), { withTheme: true })(App);
