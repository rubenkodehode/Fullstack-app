import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Form.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Noe gikk galt");
    }
  };

  return (
    <div className="form-container">
      <h2>Logg inn</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Brukernavn"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Passord"
          onChange={handleChange}
        />
        <button type="submit">Logg inn</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
