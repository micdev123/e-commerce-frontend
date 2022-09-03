import axios from "axios";

const BASE_URL = "https://mern--shop.herokuapp.com/api/";

export const userRequest = axios.create({
    baseURL: BASE_URL,
});
