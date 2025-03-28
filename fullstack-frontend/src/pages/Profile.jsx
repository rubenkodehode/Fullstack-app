import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Form.css";

const Profile = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/edit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Profilen ble oppdatert!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Noe gikk galt");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="form-container">
      <h2>Rediger profil</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Fornavn"
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Etternavn"
          onChange={handleChange}
        />
        <button type="submit">Lagre endringer</button>
      </form>
      <p>{message}</p>

      <button className="logout-btn" onClick={handleLogout}>
        Logg ut
      </button>
    </div>
  );
};

export default Profile;
