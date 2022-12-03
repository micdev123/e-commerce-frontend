import axios from "axios";

const BASE_URL = "https://angry-plum-zipper.cyclic.app/api/";

export const userRequest = axios.create({
    baseURL: BASE_URL,
});
