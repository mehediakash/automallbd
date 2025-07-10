import axios from "axios";

const API_BASE_URL = "https://server.automallbd.net/api/v1/product"; // Replace with your actual base URL

export const getAllProducts = () => axios.get(`${API_BASE_URL}/allproduct`);
export const deleteProduct = (id) =>
  axios.delete(`${API_BASE_URL}/deleteProduct/${id}`);
export const editProduct = (id, data) =>
  axios.put(`${API_BASE_URL}/editProduct/${id}`, data);
