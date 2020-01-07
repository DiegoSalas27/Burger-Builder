import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/Auxiliary";
import Burger from "../../components/burger/Burger";
import BuildControls from "../../components/burger/buildControls/BuildControls";
import Modal from "../../components/ui/modal/Modal";
import OrderSummary from "../../components/burger/orderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/ui/spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

export class BurgerBuilder extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }
  state = {
    purchasing: false
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState(updatedIngredients) {
    const sum = Object.keys(updatedIngredients)
      .map(igKey => {
        return updatedIngredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  purchaseHanlder = () => {
    //this syntax won't work correctly if the method is triggered through an evet. the This wont refer to the class
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  // purchaseContinueHanlder = () => {
  //   // alert("You continue");

  //   const queryParams = [];
  //   for (let i in this.state.ingredients) {
  //     queryParams.push(
  //       encodeURIComponent(i) +
  //         "=" +
  //         encodeURIComponent(this.state.ingredients[i])
  //     );
  //   }
  //   queryParams.push("price=" + this.state.totalPrice);
  //   const queryString = queryParams.join("&");

  //   this.props.history.push({
  //     pathname: "/checkout",
  //     search: "?" + queryString
  //   });
  // };

  purchaseContinueHanlder = () => {
    this.props.onInitPurchased();
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.props.error ? (
      <p>Ingredient's can't be loaded</p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            price={this.props.price}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientDeleted}
            disabled={disabledInfo}
            purchaseable={this.updatePurchaseState(this.props.ings)}
            isAuthenticated={this.props.isAuthenticated}
            ordered={this.purchaseHanlder}
          />
        </Aux>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHanlder}
        />
      );
    }

    // if (this.state.loading) {
    //   orderSummary = <Spinner />;
    // }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: name => dispatch(actions.addIngredient(name)),
    onIngredientDeleted: name => dispatch(actions.removeIngredient(name)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchased: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios)); //this is a higher order component to handle erros for any component it wraps
