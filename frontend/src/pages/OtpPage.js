import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function OtpPage() {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const phone = localStorage.getItem("phone");

    const handleVerify = async () => {
        try {
            const { data } = await verifyOtp(phone, otp);
            if (!data.success) return setMessage("Invalid OTP");

            if (data.exists) {
                login(data.user);
                navigate("/dashboard");
            } else {
                navigate("/register");
            }
        } catch (err) {
            setMessage("Verification failed");
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h2>Enter OTP</h2>
            <input
                type="text"
                placeholder="Enter OTP"
                className="form-control my-3"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleVerify}>
                Verify OTP
            </button>
            {message && <p className="mt-3 text-danger">{message}</p>}
        </div>
    );
}
