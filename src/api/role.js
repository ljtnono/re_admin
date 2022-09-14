import axios from "axios";
import qs from "querystring";

export const listRolePage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/role/listRolePage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteRole = (index) => {
  let id = parseInt(index);
  return axios.delete("/api/role/" + id);
};

export const restoreRole = (index) => {
  let id = parseInt(index);
  return axios.put("/api/role/restore/" + id);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    name: searchForm.name,
    description: searchForm.description,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/role/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const updateRole = (roleForm) => {
  const data = qs.stringify({
    id: roleForm.id,
    name: roleForm.name,
    description: roleForm.description
  });
  return axios.put("/api/role/" + roleForm.id, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getRoleById = (roleId) => {
  return axios.get("/api/role/" + roleId);
};

export const addRole = (roleForm) => {
  const data = qs.stringify({
    name: roleForm.name,
    description: roleForm.description
  });
  return axios.post("/api/role", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
