import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:8000/corporateTrainee" });
const API = axios.create({ baseURL: "https://e-learning-platform-server-rust.vercel.app/corporateTrainee" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
      }`;
  }
  return req;
});

export const fetchCorporates = async () => await API.get(`/`);

export const addCorporate = async (corporate) => {
  return await API.post(`/`, corporate);
};

export const addRequest = async (courseRequest) => {
  return await API.post(`/newCourseRequest`, courseRequest);
};

export const getCorporate = async () =>
  await API.get(`/${JSON.parse(localStorage.getItem("profile")).result._id}`);

export const addCourseRequest = async (request) => await API.post(`/newCourseRequest`, request);
