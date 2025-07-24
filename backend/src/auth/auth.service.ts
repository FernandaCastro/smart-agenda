import { AppError } from '../error/error.model.js';
import { IUser, PublicUser, UserDTO } from '../user/user.model.js';
import { createDB, findOne } from '../user/user.repository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
const JWT_EXPIRES_IN = "1h";

export async function processSignup(user: IUser): Promise<UserDTO> {

    const existing = await findOne(user.email);
    if (existing) throw new AppError(400, "User already exists");

    const newUser = await createDB(user);
    return newUser;
}

export async function processLogin(user: IUser): Promise<{token: string, loggedUser: PublicUser}> {

    const existing = await findOne(user.email);
    if (!existing) throw new AppError(404, "User not found");

    const isValidPassword = await bcrypt.compare(user.password, existing.password);
    if (!isValidPassword) throw new AppError(401, "Invalid password");

    const token = createJWT(existing);
    
    return {token : token, loggedUser: existing.toPublicJSON()};
}

function createJWT(user: UserDTO): string {
    const payload = user.toPublicJSON();
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    return token;
}


