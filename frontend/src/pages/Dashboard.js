import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem("phone");
        navigate("/");
    };

    if (!user) return <p className="text-center mt-5">No user logged in</p>;

    return (
        <div className="container mt-5 text-center">
            <h2>Welcome {user.first_name} {user.last_name}</h2>
            <p>Email: {user.email}</p>
            <p>DOB: {user.dob}</p>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
