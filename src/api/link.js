import axios from "axios";
import qs from "querystring";

export const listLinkPage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/link/listLinkPage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteLink = (index) => {
  let id = parseInt(index);
  return axios.delete("/api/link/" + id);
};

export const restoreLink = (index) => {
  let id = parseInt(index);
  return axios.put("/api/link/restore/" + id);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    name: searchForm.name,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/link/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const addLink = (linkForm) => {
  const data = qs.stringify({
    url: linkForm.url,
    name: linkForm.name,
    type: linkForm.type
  });
  return axios.post("/api/link", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const updateLink = (linkForm) => {
  const data = qs.stringify({
    id: linkForm.id,
    url: linkForm.url,
    name: linkForm.name,
    type: linkForm.type
  });
  return axios.put("/api/link/" + linkForm.id, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getLinkById = (linkId) => {
  return axios.get("/api/link/" + linkId);
};

