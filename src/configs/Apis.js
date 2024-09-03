import axios from "axios";
import cookie from "react-cookies"

// Đặt BASE_URL cho API
// const BASE_URL = "http://localhost:8080/online_course/api";

const SERVER_CONTEXT = "/online_course";
const SERVER = "http://localhost:8080";

export const endpoints = {
    "categories": `${SERVER_CONTEXT}/api/categories`,
    "courses": `${SERVER_CONTEXT}/api/courses/`,
    "login": `${SERVER_CONTEXT}/api/login/`,
    "detail": (courseId) => `${SERVER_CONTEXT}/api/courses/${courseId}`,
    "current-user": `${SERVER_CONTEXT}/api/current-user/`,
    "enroll-multiple": `${SERVER_CONTEXT}/api/enrollments/enroll-multiple`,
    "enrolled-courses": (userId) => `${SERVER_CONTEXT}/api/courses/enrolled-courses/${userId}`,
};

export const authApi = () => { 
    return axios.create({
        baseURL: SERVER,
        headers: {
            "Authorization": cookie.load("token")
        }
    })
}


export default axios.create({
    baseURL: SERVER
});