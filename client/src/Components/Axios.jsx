import axios from "axios";

const Axios = axios.create({
  // baseURL: "http://localhost:8000/api/v1/",
  baseURL: "https://server.automallbd.com/api/v1/",
});

export default Axios;
