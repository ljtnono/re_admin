import axios from "axios";
import qs from "querystring";

export const listSkillPage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/skill/listSkillPage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteSkill = (index) => {
  let id = parseInt(index);
  return axios.delete("/api/skill/" + id);
};

export const restoreSkill = (index) => {
  let id = parseInt(index);
  return axios.put("/api/skill/restore/" + id);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    name: searchForm.name,
    owner: searchForm.owner,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/skill/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const addSkill = (skillForm) => {
  const data = qs.stringify({
    name: skillForm.name,
    owner: skillForm.owner,
    percent: skillForm.percent
  });
  return axios.post("/api/skill", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getSkillById = (skillId) => {
  return axios.get("/api/skill/" + skillId);
};

export const updateSkill = (skillForm) => {
  const data = qs.stringify({
    id: skillForm.id,
    name: skillForm.name,
    owner: skillForm.owner,
    percent: skillForm.percent
  });
  return axios.put("/api/skill/" + skillForm.id, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
