import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/register.css";

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setColor("black");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        UserName: name,
        EmailAddress: email,
        PhoneNumber: phone,
        UserPassword: password,
        Role: "Student"
      });

      const data = res.data;

      if (data.success) {
        setColor("green");
        setMessage("Registration successful! Redirecting...");

        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        setColor("red");
        setMessage(data.message);
      }

    } catch (err) {
      setColor("red");
      setMessage("Server Error!");
    }
  };

  return (
    <div className="register-container">

      <div className="register-box">

        <h4 className="title">
          
          Student Registration
        </h4>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="mb-3 input-icon">
            <i className="fas fa-user"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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

          {/* Phone */}
          <div className="mb-3 input-icon">
            <i className="fas fa-phone"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          <button type="submit" className="btn-register">
             Register
          </button>

          {/* Message */}
          <div className="text-center mt-3" style={{ color }}>
            {message}
          </div>

          {/* Login link */}
          <div className="login-link">
            <Link to="/">Already have account? Login</Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;