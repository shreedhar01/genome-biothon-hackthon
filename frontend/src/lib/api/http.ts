import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1"


export const http = axios.create({
  baseURL: BASE_URL
});
