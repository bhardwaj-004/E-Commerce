import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}
const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Token required"
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if(typeof decoded === "object" && "id" in decoded){
            req.user = decoded.id as string;
        }
        next();
    } catch (error){
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
export default authMiddleware;