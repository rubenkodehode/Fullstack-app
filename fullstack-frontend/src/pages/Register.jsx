import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css"; // 👈 Importer vanlig CSS

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    postnr: "",
    fdato: "",
    personnr: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/create", formData);
      setMessage("Bruker registrert!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Noe gikk galt");
    }
  };

  return (
    <div className="register-container">
      <h2>Registrer deg</h2>
      <form onSubmit={handleSubmit} className="register-form">
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
        <input
          type="text"
          name="address"
          placeholder="Adresse"
          onChange={handleChange}
        />
        <input
          type="text"
          name="address2"
          placeholder="Adresse 2"
          onChange={handleChange}
        />
        <input
          type="number"
          name="postnr"
          placeholder="Postnummer"
          onChange={handleChange}
        />
        <input
          type="date"
          name="fdato"
          placeholder="Fødselsdato"
          onChange={handleChange}
        />
        <input
          type="number"
          name="personnr"
          placeholder="Personnr (5 siffer)"
          onChange={handleChange}
        />
        <button type="submit">Registrer</button>
      </form>
      {message && <p className="register-message">{message}</p>}
    </div>
  );
};

export default Register;
