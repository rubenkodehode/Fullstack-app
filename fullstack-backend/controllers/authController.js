import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const {
    username,
    password,
    fornavn,
    etternavn,
    adresse,
    adresse2,
    postNr,
    fdato,
    personnr,
  } = req.body;

  console.log("Request body:", req.body); // Debugging

  // Sjekk at alle nødvendige felt er med
  if (
    !username ||
    !password ||
    !fornavn ||
    !etternavn ||
    !adresse ||
    !postNr ||
    !fdato ||
    !personnr
  ) {
    return res
      .status(400)
      .json({ message: "Et eller flere påkrevde felter mangler." });
  }

  try {
    await db.authenticate(); // Test DB-tilkobling

    const result = await db.query(
      `EXEC sp_CreateUser 
        @Username=:username, 
        @Password=:password, 
        @Fornavn=:fornavn, 
        @Etternavn=:etternavn, 
        @Adresse=:adresse, 
        @Adresse2=:adresse2, 
        @PostNr=:postNr, 
        @Fdato=:fdato,
        @Personnr=:personnr`,
      {
        replacements: {
          username,
          password,
          fornavn,
          etternavn,
          adresse,
          adresse2,
          postNr,
          fdato,
          personnr,
        },
      }
    );

    console.log("Result from stored procedure:", result);

    // NB: Avhenger av hva sp_CreateUser returnerer.
    // Dette må justeres hvis din prosedyre returnerer f.eks. en statuskode eller resultatsett
    if (Array.isArray(result) && result[1] === -1) {
      return res
        .status(409)
        .json({ message: "Brukernavn er allerede i bruk." });
    }

    res.status(201).json({ message: "Bruker registrert!" });
  } catch (error) {
    console.error("Feil ved registrering:", error);
    res.status(500).json({ message: "Noe gikk galt på serveren." });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    await db.authenticate();

    const result = await db.query(
      "EXEC sp_Login @Username=:username, @Password=:password",
      {
        replacements: { username, password },
        type: db.QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const user = result[0];

    // ✅ 1. Generer JWT
    const token = jwt.sign(
      { id: user.PersonID, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ 2. Lagre token i `t_UsersTokens`
    await db.query(
      `INSERT INTO t_UsersTokens (Token, PersonID, TokenValidDate)
       VALUES (:token, :personId, DATEADD(HOUR, 1, GETDATE()))`,
      {
        replacements: {
          token,
          personId: user.PersonID,
        },
      }
    );

    // ✅ 3. Send tilbake til klient
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  const { firstName, lastName } = req.body;
  const token = req.header("Authorization")?.split(" ")[1]; // med fallback

  try {
    await db.authenticate();

    const result = await db.query(
      "EXEC sp_EditUser @Token=:token, @FirstName=:firstName, @LastName=:lastName",
      {
        replacements: {
          token,
          firstName,
          lastName,
        },
      }
    );

    if (result[1] === -1) {
      return res.status(401).json({ message: "Ugyldig eller utløpt token." });
    }

    res.status(200).json({ message: "Bruker oppdatert!" });
  } catch (error) {
    console.error("Feil ved oppdatering:", error);
    res.status(500).json({ message: error.message });
  }
};
