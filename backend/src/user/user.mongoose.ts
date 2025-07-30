import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  refreshToken?: string;
  expiresAt: Date,
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true},
    refreshToken: { type: String, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Password Hash before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
