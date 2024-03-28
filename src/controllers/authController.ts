import { Request, Response } from 'express';
import db from "../database/db";
import users from "../models/userSchema";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await db.select().from(users);
        res.json({ success: true, allUsers });
    } catch (error: any) {
        console.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}
