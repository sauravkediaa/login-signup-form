import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [dob, setDob] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const phone = localStorage.getItem("phone");
    const { login } = useContext(AuthContext);

    const handleRegister = async () => {
        if (email !== confirmEmail) return setMessage("Emails do not match");

        try {
            const { data } = await registerUser({ phone, firstName, lastName, email, dob });
            if (data.success) {
                setMessage(data.msg);
                login(data.user);
                navigate("/dashboard");
            } else {
                setMessage("Registration failed");
            }
        } catch (err) {
            setMessage("Error registering user");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <input type="text" placeholder="First Name" className="form-control my-2"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" className="form-control my-2"
                value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input type="email" placeholder="Email" className="form-control my-2"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="email" placeholder="Confirm Email" className="form-control my-2"
                value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
            <input type="date" className="form-control my-2"
                value={dob} onChange={(e) => setDob(e.target.value)} />
            <button className="btn btn-primary mt-2" onClick={handleRegister}>
                Register
            </button>
            {message && <p className="mt-3 text-info">{message}</p>}
        </div>
    );
}
