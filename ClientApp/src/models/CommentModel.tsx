import {UserModel} from "./UserModel";
import {PostModel} from "./PostModel";
import {CommentMarkModel} from "./CommentMarkModel";

export interface CommentModel {
    id: string;
    content: string;
    createdAt: string;
    parentComment?: CommentModel;
    creator: UserModel;
    post: PostModel;
    marks: CommentMarkModel[];
}