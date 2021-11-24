import {PostModel} from "./PostModel";
import {FileModel} from "./FileModel";

export interface UserModel {
    id: string,
    email: string,
    name: string,
    createdAt: Date,
    avatar?: FileModel,
    posts: PostModel[]
}
