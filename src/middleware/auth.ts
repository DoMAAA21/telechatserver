import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/db';
import users from '../models/userSchema';
import { eq } from 'drizzle-orm';

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    fname: string;
    lname: string;
    number: string;
    active: boolean;
    created_at: Date | string;
    updated_at: Date | string;
}

interface CustomRequest extends Request {
    user?: User;
}

export const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
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

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
        const user = await db.select().from(users).where(eq(users.id, decoded.id));

        if (!user.length) {
            res.status(500).json({ error: "User not found" });
        }
        req.user = user[0];
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
