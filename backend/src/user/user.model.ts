export interface IUser {
  id: string,
  email: string;
  name: string;
  password: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export type PublicUser ={
  id: string,
  email: string;
  name: string;
}

export class UserDTO implements IUser {

  constructor(
    public id: string,
    public email: string,
    public name: string,
    public password: string,
    public refreshToken?: string,
    public expiresAt?: Date
  ) { }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }

}