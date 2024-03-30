import { Request, Response } from 'express';
import db from "../database/db";
import users from "../models/userSchema";
import { eq } from 'drizzle-orm';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await db.select().from(users);
        res.json({ success: true, allUsers });
    } catch (error: any) {
        console.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser.length >= 1) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }

        const newUser = await db.insert(users).values(req.body).returning();
        console.log(newUser);
        res.json({ success: true, user: newUser });
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error registering user: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.error(`Error registering user: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
