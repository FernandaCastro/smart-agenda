import { AppError } from '../error/error.model.js';
import { IUser, PublicUser, UserDTO } from '../user/user.model.js';
import { createDB, findOne, saveRefreshTokenDB } from '../user/user.repository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export async function processSignup(user: IUser): Promise<UserDTO> {

    const existing = await findOne({ email: user.email });
    if (existing) throw new AppError(400, "User already exists");

    const newUser = await createDB(user);
    return newUser;
}

export async function processLogin(user: IUser): Promise<{publicUser: PublicUser, accessToken: string, refreshToken: string}> {

    const userFound = await findOne({ email: user.email });
    if (!userFound) throw new AppError(404, "User not found");

    const isValidPassword = await bcrypt.compare(user.password, userFound.password);
    if (!isValidPassword) throw new AppError(401, "Invalid password");

    const publicUser = userFound.toPublicJSON() as PublicUser;

    const accessToken = generateAccessToken(publicUser);
    const refreshToken = generateRefreshToken(publicUser);
    saveRefreshToken(userFound.id, refreshToken);

    return {publicUser, accessToken, refreshToken};
}

function saveRefreshToken(userId: string, refreshToken: string){
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const tokenSaved = saveRefreshTokenDB(userId, refreshToken, expiresAt);
    if (!tokenSaved) throw new AppError(500, "Failed to save refresh token");
}

export async function processRefreshToken(refreshToken: string): Promise<{newAccessToken: string, newRefreshToken: string }> {

    const publicUser = await validateRefreshToken(refreshToken);
       
    try {
        //generate new tokens and save the new refresh token in DB
        const newAccessToken = generateAccessToken(publicUser);
        const newRefreshToken = generateRefreshToken(publicUser);
        saveRefreshToken(publicUser.id, newRefreshToken);

        return {newAccessToken, newRefreshToken};

    } catch {
        throw new AppError(403, 'Token expired');
    }
}

const generateAccessToken = (payload: PublicUser) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

const generateRefreshToken = (payload: PublicUser) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};

async function validateRefreshToken(token: string): Promise<PublicUser> {
    const payload = jwt.verify(token, REFRESH_SECRET) as PublicUser;
    const stored = await findOne({ email: payload.email });

    if (!stored || !stored.expiresAt || stored.expiresAt < new Date())
        throw new AppError(403, 'Invalid refresh token');

    return stored.toPublicJSON() as PublicUser;
}



