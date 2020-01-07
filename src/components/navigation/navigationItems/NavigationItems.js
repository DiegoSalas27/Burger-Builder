import React from "react";
import classes from "./NavigationItems.module.css";
import NavigationItem from "./navigationItem/NavigationItem";

const NavigationItems = props => (
  <ul className={classes.NavigationItems}>
    {/* <NavigationItem link="/" active> */}
    <NavigationItem link="/" exact>
      Burger Builder
    </NavigationItem>

    {!props.isAuthenticated ? (
      <NavigationItem link="/auth">Authenticate</NavigationItem>
    ) : (
      <>
        <NavigationItem link="/orders">Orders</NavigationItem>
        <NavigationItem link="/logout">Logout</NavigationItem>
      </>
    )}
  </ul>
);

export default NavigationItems;
