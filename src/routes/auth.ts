import { Router } from "express";
import { getAllUsers, registerUser, loginUser, logout } from "../controllers/authController";
const router = Router();

router.get("/all-users", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser );
router.post("/logout", logout)

export default router;