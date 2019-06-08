import axios from "axios";
import Auth from "@aws-amplify/auth";

const ajax = axios.create({
  baseURL: "https://aholonoww3.execute-api.us-west-2.amazonaws.com/v1"
});

ajax.interceptors.request.use(
  async config => {
    const session = await Auth.currentSession();
    let token = session.getIdToken().getJwtToken();

    if (token) {
      config.headers["Authorization"] = token;
    }

    return config;
  },

  error => {
    return Promise.reject(error);
  }
);

export default ajax;
