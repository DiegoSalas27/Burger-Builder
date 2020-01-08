import React, { useState } from "react";
import { connect } from "react-redux";
import Aux from "../Auxiliary";
import classes from "./Layout.module.css";
import Toolbar from "../../components/navigation/toolbar/Toolbar";
import SideDrawer from "../../components/navigation/sideDrawer/SideDrawer";

const Layout = props => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  const sideDrawerCloseHandler = () => {
    setShowSideDrawer(false);
  };

  const sideDrawerToggleHandler = () => {
    setShowSideDrawer(!showSideDrawer);
  };
  return (
    <Aux>
      <Toolbar
        isAuthenticated={props.isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}
      />
      <SideDrawer
        isAuthenticated={props.isAuthenticated}
        closed={sideDrawerCloseHandler}
        open={showSideDrawer}
      />
      <main className={classes.Content}>{props.children}</main>
    </Aux>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(Layout);
