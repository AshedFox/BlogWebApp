import {PostModel} from "./PostModel";
import {FileModel} from "./FileModel";
import {UserGender} from "./UserGender";
import {CommentModel} from "./CommentModel";
import {PostMarkModel} from "./PostMarkModel";
import {CommentMarkModel} from "./CommentMarkModel";

export interface UserModel {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    selfInformation: string;
    bornAt: string;
    gender: UserGender;
    avatar?: FileModel;
    createdPosts: PostModel[];
    postsMarks: PostMarkModel[];
    createdComments: CommentModel[];
    commentsMarks: CommentMarkModel[];
}