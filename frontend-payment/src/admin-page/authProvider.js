import qs from "qs";
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR } from "react-admin";
import { baseURL } from "../constants";

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const request = new Request(`${baseURL}/oauth2/token`, {
      method: "POST",
      body: qs.stringify({
        grant_type: "password",
        client_id: "iframe",
        client_secret: "123456",
        username,
        password,
        scope: "admin"
      }),
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ accessToken }) => {
        localStorage.setItem("accessToken", accessToken);
      });
  }
  if (type === AUTH_ERROR) {
    if (params.graphQLErrors) {
      const authenticationError = params.graphQLErrors.find(
        error => error.extensions.code === "UNAUTHENTICATED"
      );
      if (authenticationError) {
        localStorage.removeItem("accessToken");
        return Promise.reject();
      }
    }
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("accessToken");
    return Promise.resolve();
  }
  return Promise.resolve();
};
