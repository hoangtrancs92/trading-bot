import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;
export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainTextPassword, hashedPassword);
}