import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", //will change in production
});

export const sendOtp = (phone) => API.post("/send-otp", { phone });
export const verifyOtp = (phone, otp) => API.post("/verify-otp", { phone, otp });
export const registerUser = (data) => API.post("/register", data);
