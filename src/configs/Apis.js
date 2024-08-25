import axios from "axios";

const SERVER_CONTEXT = "/online_course";
export const endpoints = {
    "categories":`${SERVER_CONTEXT}/api/categories`,
    "courses": `${SERVER_CONTEXT}/api/courses/`,
    "login": `${SERVER_CONTEXT}/api/login/`
}
export default axios.create(
    { baseURL: "http://localhost:8080" }
)