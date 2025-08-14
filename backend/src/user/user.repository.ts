import { AppError } from "../error/error.model";
import { IUser, UserDTO } from "./user.model";
import UserModel from "./user.mongoose";


export const findOne = async (criteria: Partial<UserDTO>): Promise<UserDTO|null> => {
    const doc = await UserModel.findOne(criteria ).exec();
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

export async function saveRefreshTokenDB(userId: string, token: string, expiresAt: Date ): Promise<boolean> {
    try {
      const updateData = { refreshToken: token, expiresAt: expiresAt };
      const result = await UserModel.findOneAndUpdate({ _id: userId }, updateData, {
        new: true,
        runValidators: true,
      });

     return (result !== null);
  
    } catch (error) {
      console.error("Error updating Refresh Token:", error);
      throw new AppError(400, "Failed to update Refresh Token");
    }
  }


// Convert Mongoose Document -> UserDTO
const toUser = (doc: any): UserDTO => (
    new UserDTO(
        doc._id.toString(),
        doc.email,
        doc.name,
        doc.password,
        doc.refreshToken || undefined,
        doc.expiresAt ? new Date(doc.expiresAt) : undefined
    ));

function toUserModel(user: Partial<UserDTO>): any {
    return {
        name: user.name,
        email: user.email,
        password: user.password,
    };
}