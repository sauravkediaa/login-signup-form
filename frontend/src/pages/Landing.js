import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../utils/api";

export default function Landing() {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!phone) return setMessage("Please enter phone number");
        try {
            await sendOtp(phone);
            localStorage.setItem("phone", phone);
            navigate("/otp");
        } catch (err) {
            setMessage("Error sending OTP");
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h2>Login / Signup</h2>
            <input
                type="text"
                placeholder="Enter phone number with country code"
                className="form-control my-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSendOtp}>
                Send OTP
            </button>
            {message && <p className="mt-3 text-danger">{message}</p>}
        </div>
    );
}
