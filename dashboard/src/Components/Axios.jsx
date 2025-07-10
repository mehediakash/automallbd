import axios from "axios";

const api = axios.create({
  baseURL: "https://server.automallbd.net/api/v1/",
  // baseURL: "http://localhost:8000/api/v1/",
});

export default api;
