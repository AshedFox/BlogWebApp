import {UserModel} from "./UserModel";
import {FileModel} from "./FileModel";
import {CommentModel} from "./CommentModel";
import {PostMarkModel} from "./PostMarkModel";

export interface PostModel {
    id: string;
    title: string;
    createdAt: Date;
    creator: UserModel;
    cover?: FileModel;
    content: string;
    marks: PostMarkModel[];
    comments: CommentModel[];
}
