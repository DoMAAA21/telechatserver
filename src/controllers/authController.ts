import { Request, Response } from 'express';
import db from '../database/db';
import users from '../models/userSchema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import sendToken from '../utils/sendToken';
import { compare } from 'bcrypt';


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await db.select().from(users);
        res.json({ success: true, allUsers });
    } catch (error: any) {
        console.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await db.select().from(users).where(eq(users.email, email));
        if (!user || user.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const passwordMatch = await compare(password, user[0].password);

        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
        sendToken(user[0], res);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error user login: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.error(`Error registering user: ${error}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, number, password } = req.body;

        const numberPattern = /^0\d{10}(?:\*{6})?$/;
        if (!numberPattern.test(number)) {
            res.status(400).json({ message: 'Invalid number format' });
            return;
        }

        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length >= 1) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }
        const duplicateUsername = await db.select().from(users).where(eq(users.username, username));
        if (duplicateUsername.length >= 1) {
            res.status(400).json({ message: 'Username is already taken' });
            return;
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserData = {
            ...req.body,
            password: hashedPassword
        }
        const newUser = await db.insert(users).values(newUserData).returning();
        sendToken(newUser[0], res);
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

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: "Logged out",
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error user logout: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.error(`Error registering user: ${error}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
