import axios from "axios";
import qs from "querystring";

export const adminIndexData = () => {
  return axios.get("/api/adminIndexData");
};
