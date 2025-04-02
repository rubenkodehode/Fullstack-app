import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css"; // 👈 Importer vanlig CSS

const Register = () => {
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    FirstName: "",
    LastName: "",
    Address: "",
    Address2: "",
    PostNr: "",
    Fdato: "",
    Personnr: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = new Date(formData.Fdato).toISOString().split("T")[0];

    try {
      await api.post("/create", { ...formData, Fdato: formattedDate });
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
          name="Username"
          placeholder="Brukernavn"
          onChange={handleChange}
        />
        <input
          type="password"
          name="Password"
          placeholder="Passord"
          onChange={handleChange}
        />
        <input
          type="text"
          name="FirstName"
          placeholder="Fornavn"
          onChange={handleChange}
        />
        <input
          type="text"
          name="LastName"
          placeholder="Etternavn"
          onChange={handleChange}
        />
        <input
          type="text"
          name="Address"
          placeholder="Adresse"
          onChange={handleChange}
        />
        <input
          type="text"
          name="Address2"
          placeholder="Adresse 2"
          onChange={handleChange}
        />
        <input
          type="number"
          name="PostNr"
          placeholder="Postnummer"
          onChange={handleChange}
        />
        <input
          type="date"
          name="Fdato"
          placeholder="Fødselsdato"
          onChange={handleChange}
        />
        <input
          type="number"
          name="Personnr"
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
