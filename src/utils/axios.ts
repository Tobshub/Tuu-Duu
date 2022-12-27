import axios from "axios";
import env from "@data/env.json";

const useApi = axios.create({
  headers: {
    "Content-Type": "application/json; encoding=utf-8",
    "Access-Control-Allow-Origin": "*",
  },
  method: "cors",
  timeout: 3000, // use timeout config incase the server is spun down
  baseURL: env.REACT_APP_TUU_DUU_API,
});

export default useApi;
