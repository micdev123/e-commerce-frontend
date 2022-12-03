import axios from "axios";

const BASE_URL = "https://e-commerce-app.adaptable.app/api/";

export const userRequest = axios.create({
    baseURL: BASE_URL,
});
