import { Router } from "express";
import { getAllUsers } from "../controllers/authController";
const router = Router();

router.get("/all-users",getAllUsers);

export default router;