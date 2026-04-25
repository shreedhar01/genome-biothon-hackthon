import axios from "axios";
import {config} from "./index"


export const http = axios.create({
  baseURL: config.MODEL_API
});
