import {PostModel} from "./PostModel";

export interface UserModel {
    id: string,
    email: string,
    name: string,
    createdAt: Date,
    posts: PostModel[]
}
