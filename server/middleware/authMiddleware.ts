import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // load environment variables

// Extend Express Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Extract token from 'Bearer <token>' and trim spaces
  const token = req.header("Authorization")?.replace("Bearer", "").trim();
  
  // Check if token exists
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return; // No further processing after response
  }

  // Verify Token
  try {
    const secretKey = process.env.JWT_SECRET_KEY!;
    const decoded = jwt.verify(token, secretKey) as { id: number; email: string };
    req.user = decoded; // Attach user info to the request
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(403).json({ message: "Invalid token." });
    return; // No further processing after response
  }
};

export default authenticateToken;

