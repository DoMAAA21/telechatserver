import { Request, Response, NextFunction } from 'express';
import type { User } from '../models/userSchema';
import jwt from 'jsonwebtoken';
import db from '../database/db';
import users from '../models/userSchema';

interface CustomRequest extends Request {
    ...Request,
    user?: any; 
}


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.cookies;

    if (!token) {
        res.status(401).json({ error: "Login first to access this resource." });
        return; 
    }

    try {
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ error: "Provide JWT SECRET FIRST" });
            return; 
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id : number};

        req.user = await db.select().from(users).where('id', decoded).first();

        next(); 
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error in isAuthenticated middleware: ${error.message}`);
            res.status(401).json({ error: "Invalid token." });
        } else {
            console.error(`Error in isAuthenticated middleware: Unknown error`);
            res.status(500).json({ error: "Internal server error." });
        }
    }
};
