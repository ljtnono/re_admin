import axios from "axios";
import qs from "querystring";
import moment from "moment";

export const listTimelineAll = () => {
  return axios.get("/api/timeline");
};

export const listTimelinePage = (page, count) => {
  let p = page || 1;
  let c = count || 10;
  return axios.get("/api/timeline/listTimelinePage", {
    params: {
      page: p,
      count: c
    }
  });
};

export const deleteTimeline = (index) => {
  let id = parseInt(index);
  return axios.delete("/api/timeline/" + id);
};

export const restoreTimeline = (index) => {
  let id = parseInt(index);
  return axios.put("/api/timeline/restore/" + id);
};

export const search = (searchForm, pageParam) => {
  const data = qs.stringify({
    content: searchForm.content,
    pushDate: searchForm.pushDate,
    page: pageParam.page,
    count: pageParam.count
  });
  return axios.post("/api/timeline/search", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const getTimelineById = (timelineId) => {
  return axios.get("/api/timeline/" + timelineId);
};

export const updateTimeline = (timelineForm) => {
  console.log(timelineForm);
  const data = qs.stringify({
    id: timelineForm.id,
    content: timelineForm.content,
    pushDate: moment(timelineForm.pushDate).format("YYYY-MM-DD")
  });
  return axios.put("/api/timeline/" + timelineForm.id, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const addTimeline = (timelineForm) => {
  const data = qs.stringify({
    content: timelineForm.content,
    pushDate: moment(timelineForm.pushDate).format("YYYY-MM-DD")
  });
  return axios.post("/api/timeline", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};
