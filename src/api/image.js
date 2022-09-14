import axios from "axios";
import qs from "querystring";

export const listImagePage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/image/listImagePage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteImage = (index) => {
  return axios.delete("/api/image/" + index);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    originName: searchForm.originName,
    type: searchForm.type,
    owner: searchForm.owner,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/image/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

