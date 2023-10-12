import axios from "axios";
import { API_BASE } from "constants/domain";


const request = axios.create({
    baseURL: API_BASE
});

export default request;