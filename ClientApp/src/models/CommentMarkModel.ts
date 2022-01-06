import {CommentModel} from "./CommentModel";
import {UserModel} from "./UserModel";

export interface CommentMarkModel {
    id: string;
    commentId: string;
    comment: CommentModel;
    userId: string;
    user: UserModel;
    value: number;
}