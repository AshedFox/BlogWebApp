import {UserModel} from "./UserModel";

export interface PostModel {
    id: string,
    title: string,
    createdAt: Date,
    creator: UserModel
    content: string
}
