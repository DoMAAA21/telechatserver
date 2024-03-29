import { Router } from "express";
import { getAllUsers, registerUser } from "../controllers/authController";
const router = Router();

router.get("/all-users", getAllUsers);
router.post("/register", registerUser);

export default router;