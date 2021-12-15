import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000", //The api cloud function url
});

export default instance;
