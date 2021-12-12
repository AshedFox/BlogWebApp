import {UserModel} from "./UserModel";
import {FileModel} from "./FileModel";
import {CommentModel} from "./CommentModel";

export interface PostModel {
    id: string,
    title: string,
    createdAt: Date,
    creator: UserModel,
    cover?: FileModel,
    content: string,
    totalMark: number,
    marksCount: number,
    comments: CommentModel[]
}
