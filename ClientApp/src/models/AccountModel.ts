import {UserModel} from "./UserModel";

export interface AccountModel {
    user: UserModel
    authToken: string
    tokenValidTo: Date
}
