import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, SALT_ROUNDS);
export const comparePassword = (password: string, hashedPassword: string): Promise<boolean> =>
  bcrypt.compare(password, hashedPassword);
