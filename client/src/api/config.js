import axios from "axios";
import { io } from "socket.io-client";

const apiUrl = process.env.URL_SERVER || "http://localhost:8080"

export const socket = io(apiUrl);

export default axios.create({
  baseURL: apiUrl + "/api",
  headers: {
    "Content-Type": "application/json",
  },
}); 