import axios from "axios";

const instance = axios.create({
  baseURL: "https://burger-app-b1c39.firebaseio.com/"
});

export default instance;
