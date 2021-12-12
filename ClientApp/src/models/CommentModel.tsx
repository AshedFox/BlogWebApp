import {UserModel} from "./UserModel";
import {PostModel} from "./PostModel";

export interface CommentModel {
    id: string,
    content: string,
    createdAt: Date,
    parentComment?: CommentModel,
    creator: UserModel,
    post: PostModel,
    totalMark: number,
    marksCount: number,
}