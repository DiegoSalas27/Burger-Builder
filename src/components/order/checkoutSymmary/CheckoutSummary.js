import React from "react";
import Burger from "../../burger/Burger";
import Button from "../../ui/button/Button";
import classes from "./CheckoutSummary.module.css";

function CheckoutSummary(props) {
  return (
    <div className={classes.CheckoutSummary}>
      <h1>We hope it tastes well!</h1>
      <div style={{ width: "100%", margin: "auto" }}>
        <Burger ingredients={props.ingredients} />
      </div>
      <Button clicked={props.checkoutCancelled} btnType="Danger">
        Cancel
      </Button>
      <Button clicked={props.checkoutContinued} btnType="Success">
        Continue
      </Button>
    </div>
  );
}

export default CheckoutSummary;
