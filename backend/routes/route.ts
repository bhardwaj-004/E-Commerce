import express from "express";
import {
    register,
    login,
    me,
    getUsers
} from "../controllers/controller";
import authMiddleware from "../middleware/authmiddleware";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.get("/users", getUsers);
export default router;