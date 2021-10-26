import {PostModel} from "../models/PostModel";

export interface GetPostsResultDto {
    posts: PostModel[];
    maxPage: number;
}