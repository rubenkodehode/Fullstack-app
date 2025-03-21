import express from "express";
import { register, editUser, login } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", register);
router.post("/edit", authMiddleware, editUser);
router.post("/login", login);

export default router;
