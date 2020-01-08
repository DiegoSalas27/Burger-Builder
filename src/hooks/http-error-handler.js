import { useState, useEffect } from "react";

export default httpClient => {
  const [error, setError] = useState(null);

  //useEffect runs after the render cycle

  // execute code before jsx code is rendered (replaces component will mount)
  const reqInterceptor = httpClient.interceptors.request.use(req => {
    setError(null);
    return req;
  });
  const resInterceptor = httpClient.interceptors.response.use(
    res => res,
    err => {
      setError(err);
    }
  );

  useEffect(() => {
    return () => {
      httpClient.interceptors.request.eject(reqInterceptor);
      httpClient.interceptors.response.eject(resInterceptor);
    };
  }, [reqInterceptor, resInterceptor]); //array allows us to unmount component

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler];
};
