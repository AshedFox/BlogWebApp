import {UserModel} from "./UserModel";

export interface AccountModel {
    userId: string,
    accessToken: string,
    refreshToken: string
}
