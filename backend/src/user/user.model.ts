export interface IUser {
  id: string,
  email: string;
  name: string;
  password: string;
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
  ) { }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
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