import {UserModel} from "./UserModel";
import {FileModel} from "./FileModel";

export interface PostModel {
    id: string,
    title: string,
    createdAt: Date,
    creator: UserModel,
    cover?: FileModel,
    content: string
}
