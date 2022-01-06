import {PostModel} from "./PostModel";
import {UserModel} from "./UserModel";

export interface PostMarkModel {
    id: string;
    postId: string;
    post: PostModel;
    userId: string;
    user: UserModel;
    value: number;
}

