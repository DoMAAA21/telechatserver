import { Router } from "express";
import { getAllUsers, registerUser, loginUser } from "../controllers/authController";
const router = Router();

router.get("/all-users", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser );

export default router;