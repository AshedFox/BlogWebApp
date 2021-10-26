import {UserModel} from "../models/UserModel";

export interface LoginResultDto {
    user: UserModel,
    authToken: string,
    tokenValidTo: Date
}
