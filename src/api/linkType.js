import axios from "axios";
import qs from "querystring";

export const listLinkTypeAll = () => {
  return axios.get("/api/link_type");
};

export const listLinkTypePage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/link_type/listLinkTypePage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteLinkType = (index) => {
  let id = parseInt(index);
  return axios.delete("/api/link_type/" + id);
};

export const restoreLinkType = (index) => {
  let id = parseInt(index);
  return axios.put("/api/link_type/restore/" + id);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    name: searchForm.name,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/link_type/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const addLinkType = (linkTypeForm) => {
  const data = qs.stringify({
    name: linkTypeForm.name
  });
  return axios.post("/api/link_type", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const updateLinkType = (linkTypeForm) => {
  const data = qs.stringify({
    id: linkTypeForm.id,
    name: linkTypeForm.name
  });
  return axios.put("/api/link_type/" + linkTypeForm.id, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getLinkTypeById = (linkTypeId) => {
  return axios.get("/api/link_type/" + linkTypeId);
};
