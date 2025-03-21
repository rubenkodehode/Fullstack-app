import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    await db.authenticate(); // ✅ Sjekker tilkoblingen
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(
      "EXEC sp_CreateUser @Username=:username, @Password=:password",
      {
        replacements: { username, password: hashedPassword },
      }
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    await db.authenticate();

    // 🔹 Kall `sp_Login` for å verifisere brukeren
    const result = await db.query(
      "EXEC sp_Login @Username=:username, @Password=:password",
      {
        replacements: { username, password },
        type: db.QueryTypes.SELECT,
      }
    );

    // 🔹 Sjekk om brukeren finnes
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const user = result[0];

    // 🔹 Backend genererer JWT-token
    const token = jwt.sign(
      { id: user.PersonID, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  const { firstName, lastName } = req.body; // <-- Hent fra request body
  const token = req.header("Authorization").split(" ")[1]; // <-- Hent token fra header

  try {
    await db.authenticate();

    const result = await db.query(
      "EXEC sp_EditUser @Token=:token, @FirstName=:firstName, @LastName=:lastName",
      {
        replacements: {
          token,
          firstName, // <-- Bruker samme navn som SQL-prosedyren
          lastName,
        },
      }
    );

    res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
