import { User } from "./user.model";

export interface newUser extends User {
    email: string;
    repeatPassword: string;
}