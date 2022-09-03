import axios from "axios";

const BASE_URL = "https://mern-app-blog-app.herokuapp.com/api/";

export const userRequest = axios.create({
    baseURL: BASE_URL,
});
