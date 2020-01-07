import React from "react";
import Logo from "../../logo/Logo";
import NavigationItems from "../navigationItems/NavigationItems";
import classes from "./SideDrawer.module.css";
import Backdrop from "../../ui/backdrop/Backdrop";
import Aux from "../../../hoc/Auxiliary";

const SideDrawer = props => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(" ")} onClick={props.closed}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems isAuthenticated={props.isAuthenticated} />
        </nav>
      </div>
    </Aux>
  );
};

export default SideDrawer;
