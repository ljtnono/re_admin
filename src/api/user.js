import qs from "querystring";
import axios from "axios";

export const listUserPage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/user/listUserPage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteUser = (index) => {
  let id = parseInt(index);
  return axios.delete("/api/user/" + id);
};

export const restoreUser = (index) => {
  let id = parseInt(index);
  return axios.put("/api/user/restore/" + id);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    username: searchForm.username,
    tel: searchForm.tel,
    email: searchForm.email,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/user/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const updateUser = (userForm) => {
  const data = qs.stringify({
    id: userForm.id,
    username: userForm.username,
    password: userForm.password,
    qq: userForm.qq,
    tel: userForm.tel,
    email: userForm.email
  });
  return axios.put("/api/user/" + userForm.id, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getUserById = (userId) => {
  return axios.get("/api/user/" + userId);
};

export const addUser = (userForm) => {
  const data = qs.stringify({
    username: userForm.username,
    password: userForm.password,
    qq: userForm.qq,
    tel: userForm.tel,
    email: userForm.email
  });
  return axios.post("/api/user", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const login = (username, password) => {
  const data = qs.stringify({
    username: username,
    password: password
  });
  return axios.post("/api/doLogin", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getUserInfo = (token) => {
  return axios.get("/api/user/getUserInfoByToken", {
    params: {
      token: token
    }
  });
};
