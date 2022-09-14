import axios from "axios";
import qs from "querystring";

export const listBlogTypeAll = () => {
  return axios.get("/api/blog_type");
};

export const listBlogTypePage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/blog_type/listBlogTypePage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteBlogType = (index) => {
  let id = parseInt(index);
  return axios.delete("/api/blog_type/" + id);
};

export const restoreBlogType = (index) => {
  let id = parseInt(index);
  return axios.put("/api/blog_type/restore/" + id);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    name: searchForm.name,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/blog_type/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getBlogTypeById = (blogTypeId) => {
  return axios.get("/api/blog_type/" + blogTypeId);
};

export const updateBlogType = (blogTypeForm) => {
  const data = qs.stringify({
    id: blogTypeForm.id,
    name: blogTypeForm.name,
    description: blogTypeForm.description
  });
  return axios.put("/api/blog_type/" + blogTypeForm.id, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const addBlogType = (blogTypeForm) => {
  const data = qs.stringify({
    name: blogTypeForm.name,
    description: blogTypeForm.description
  });
  return axios.post("/api/blog_type", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
