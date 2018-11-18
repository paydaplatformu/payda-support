export interface IUserCreator {
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  createdAt: Date;
  role: string;
}
