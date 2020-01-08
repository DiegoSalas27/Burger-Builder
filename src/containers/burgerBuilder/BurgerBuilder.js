import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Aux from "../../hoc/Auxiliary";
import Burger from "../../components/burger/Burger";
import BuildControls from "../../components/burger/buildControls/BuildControls";
import Modal from "../../components/ui/modal/Modal";
import OrderSummary from "../../components/burger/orderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/ui/spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();

  const ings = useSelector(state => {
    return state.burgerBuilder.ingredients;
  });
  const price = useSelector(state => {
    return state.burgerBuilder.totalPrice;
  });
  const error = useSelector(state => {
    return state.burgerBuilder.error;
  });
  const isAuthenticated = useSelector(state => {
    return state.auth.token !== null;
  });

  const onIngredientAdded = name => dispatch(actions.addIngredient(name));
  const onIngredientDeleted = name => dispatch(actions.removeIngredient(name));
  const onInitIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    []
  );
  const onInitPurchased = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = path =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = updatedIngredients => {
    const sum = Object.keys(updatedIngredients)
      .map(igKey => {
        return updatedIngredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  const purchaseHanlder = () => {
    //this syntax won't work correctly if the method is triggered through an evet. the This wont refer to the class
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath("/checkout");
      props.history.push("/auth");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHanlder = () => {
    onInitPurchased();
    props.history.push("/checkout");
  };

  const disabledInfo = {
    ...ings
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;
  let burger = error ? <p>Ingredient's can't be loaded</p> : <Spinner />;

  if (ings) {
    burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          price={price}
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientDeleted}
          disabled={disabledInfo}
          purchaseable={updatePurchaseState(ings)}
          isAuthenticated={isAuthenticated}
          ordered={purchaseHanlder}
        />
      </Aux>
    );

    orderSummary = (
      <OrderSummary
        ingredients={ings}
        price={price}
        purchaseCanceled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHanlder}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

export default withErrorHandler(BurgerBuilder, axios); //this is a higher order component to handle erros for any component it wraps
