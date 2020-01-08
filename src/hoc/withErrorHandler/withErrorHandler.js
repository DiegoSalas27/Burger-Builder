import React from "react";
import Modal from "../../components/ui/modal/Modal";
import Aux from "../Auxiliary";
import useHttpErrorHanlder from "../../hooks/http-error-handler";

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    const [error, clearError] = useHttpErrorHanlder(axios); // this hook allows us to have many different errors handlers
    // we reuse logic and state, but can render different html in the end

    return (
      <Aux>
        <Modal show={error} modalClosed={clearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
