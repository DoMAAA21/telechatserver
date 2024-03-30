import { Response } from 'express'; 
import jwt from 'jsonwebtoken';
import type { User } from '../models/userSchema';

const sendToken = (user: User, res: Response): void => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT secret is not defined in the environment variables.");
    }

    const userCredentials = {
        id: user.id,
        name: user.fname,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        number: user.number
    };

    const token: string = jwt.sign(userCredentials, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    
    const options = {
        expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
    };

    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user
    });
};

export default sendToken;