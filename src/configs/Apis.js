import axios from "axios";
import cookie from "react-cookies"

// Đặt BASE_URL cho API
// const BASE_URL = "http://localhost:8080/online_course/api";

const SERVER_CONTEXT = "/online_course";
const SERVER = "http://localhost:8080";

export const endpoints = {
//ROLE_STUDENT, ROLE_ADMIN, ROLE_TEACHER
    "categories": `${SERVER_CONTEXT}/api/categories`,
    "courses": `${SERVER_CONTEXT}/api/courses/`,
    "login": `${SERVER_CONTEXT}/api/login/`,
    "detail": (courseId) => `${SERVER_CONTEXT}/api/courses/${courseId}`,
    "current-user": `${SERVER_CONTEXT}/api/current-user/`,
    "register": `${SERVER_CONTEXT}/api/users/register`,
    "get-exercises-by-courseId": (courseId) => `${SERVER_CONTEXT}/api/exercises/${courseId}`,
//ROLE_USER, ROLE_ADMIN
    "enroll-multiple": `${SERVER_CONTEXT}/api/enrollments/enroll-multiple`,
    "enrolled-courses": (userId) => `${SERVER_CONTEXT}/api/courses/enrolled-courses/${userId}`,
    "enroll-check": (userId, courseId) => `${SERVER_CONTEXT}/api/enrollments/enroll-check?userId=${userId}&courseId=${courseId}`,
    "enroll-progress": (userId,courseId ) => `${SERVER_CONTEXT}/api/enrollments/enroll-progress?userId=${userId}&courseId=${courseId}`,
    "add-rating": `${SERVER_CONTEXT}/api/ratings/add`,
    "submit-exercise": (exerciseId) => `${SERVER_CONTEXT}/api/submissions/exercises/${exerciseId}/submit`,
//ROLE_TEACHER, ROLE_ADMIN
    "coursesByTeacherId": (teacherId) => `${SERVER_CONTEXT}/api/courses/get-course-by-teacher/${teacherId}`,
    "score-feedback": (submissionId) => `${SERVER_CONTEXT}/api/submissions/${submissionId}`,
    "add-exercise": `${SERVER_CONTEXT}/api/exercises/add-exercise`,
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