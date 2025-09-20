import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../utils/multer.js";

const router = express.Router();

// Auth routes
router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);

// Profile update (protected)
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);

export default router;
