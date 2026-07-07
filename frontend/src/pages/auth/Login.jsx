import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/login.css";

const Login = () => {

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setColor("black");

    if (role === "") {
      setColor("orange");
      setMessage("Please select role");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        EmailAddress: email,
        UserPassword: password,
      });

      const data = res.data;

      if (data.success) {

        // Role mismatch
        if (data.data.role !== role) {
          setColor("orange");
          setMessage("Selected role does not match your account!");
          return;
        }

        localStorage.setItem("token", data.data.token);
        localStorage.setItem("role", data.data.role);

        setColor("green");
        setMessage("Login Successful! Redirecting...");

        setTimeout(() => {
          if (role === "Admin") navigate("/admin/dashboard");
          else if (role === "Coordinator") navigate("/coordinator/dashboard");
          else navigate("/student/dashboard");
        }, 1000);

      } else {
        setColor("red");

        if (role === "Student") {
          setMessage("Account not found! Please register first.");
        } else {
          setMessage(data.message);
        }
      }

    } catch (err) {
      setColor("red");
      setMessage("Server Error!");
    }
  };

  return (
  <div className="login-container">

    <div className="login-box">

      <h4 className="login-title">
        <i className="fas fa-calendar-alt"></i>
        Frolic Event Login
      </h4>

      <form onSubmit={handleLogin}>

        {/* Role */}
        <div className="mb-3">
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Student">Student</option>
          </select>
        </div>

        {/* Email */}
        <div className="mb-3 input-icon">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3 input-icon">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button type="submit" className="btn-login">
          <i className="fas fa-sign-in-alt"></i> Login
        </button>

        {/* Register */}
        {role === "Student" && (
          <div className="register-link">
            <a href="/register">New Student? Register here</a>
          </div>
        )}

        {/* Message */}
        <div className="text-center mt-3" style={{ color }}>
          {message}
        </div>

      </form>
    </div>
  </div>
);
};

export default Login;