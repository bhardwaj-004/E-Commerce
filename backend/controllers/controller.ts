import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import users from "../models/usermodel";
import authMiddleware from "../middleware/authmiddleware";

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}

const router = express.Router();

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const exists = users.find(user => user.email === email);

        if (exists) {
            return res.status(400).json({
                message: "user already exists"
            });
        }

        const hashpass = await bcrypt.hash(password, 10);
        const user = {
            id: users.length + 1,
            name,
            email,
            password: hashpass
        };
        users.push(user);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            "mysecretkey",
            {
                expiresIn: "1h"
            }
        );
        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
};
const me = (req: AuthRequest, res: Response) => {
    res.json({
        message: "User information",
        user: req.user
    });
};
const getUsers = (req: Request, res: Response) => {
    const userlist = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email
    }));

    res.json(userlist);
};
//routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.get("/users", getUsers);
export default router;