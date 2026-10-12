import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import User from "../models/usermodel";
import authMiddleware from "../middleware/authmiddleware";

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}
const router = express.Router();
const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message: "user registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h"
            }
        );
        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const me = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
export default router;