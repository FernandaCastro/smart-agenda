import { AppError } from "../error/error.model.js";
import { IUser, UserDTO } from "./user.model.js";
import UserModel from "./user.mongoose.js";


export const findOne = async (email: string): Promise<UserDTO|null> => {
    const doc = await UserModel.findOne({ email }).exec();
    if(!doc) return null;
    return toUser(doc);
};


export const createDB = async (data: Omit<IUser, 'id'>): Promise<UserDTO> => {

    try {

        const doc = await UserModel.create(data);
        return toUser(doc);

    } catch (error) {
        console.error("Error creating user:", error);
        throw new AppError(400, "Failed to create user");
    }
};


// Convert Mongoose Document -> UserDTO
const toUser = (doc: any): UserDTO => (
    new UserDTO(
        doc._id.toString(),
        doc.email,
        doc.name,
        doc.password
    ));

function toUserModel(user: Partial<UserDTO>): any {
    return {
        name: user.name,
        email: user.email,
        password: user.password,
    };
}