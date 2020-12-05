import qs from "qs";

const authProvider = {
  login: params => {
    const { username, password } = params;
    const request = new Request("/oauth2/token", {
      method: "POST",
      body: qs.stringify({
        grant_type: "password",
        client_id: "iframe",
        client_secret: "123456",
        username,
        password,
        scope: "admin",
      }),
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
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
  },
  checkError: error => {
    if (error && error.message.includes("Authorization needed to access this function.")) {
      localStorage.removeItem("accessToken");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: params => (localStorage.getItem("accessToken") ? Promise.resolve() : Promise.reject()),
  logout: () => {
    localStorage.removeItem("accessToken");
    return Promise.resolve();
  },
  getIdentity: () => Promise.resolve(),
  getPermissions: params => Promise.resolve(),
};

export default authProvider;
