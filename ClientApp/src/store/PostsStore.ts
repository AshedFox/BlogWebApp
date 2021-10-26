import {makeAutoObservable} from "mobx";
import {PostToAddDto} from "../DTOs/PostToAddDto";
import {PostToEditDto} from "../DTOs/PostToEditDto";
import {PostModel} from "../models/PostModel";
import postsService from "../services/postsService";
import {createContext, useContext} from "react";
import {GetPostsResultDto} from "../DTOs/GetPostsResultDto";

export enum PostsStoreStatus {
    None = "None",
    Loading = "Loading",
    Success = "Success",
    Error = "Error"
}

class Posts {
    constructor() {
        makeAutoObservable(this);
    }

    posts: PostModel[] = [];
    status = PostsStoreStatus.None;

    currentPage = 0;
    countPerPage = 1;
    maxPage = 0;

    setNextPage = () => this.currentPage++;
    setPrevPage = () => this.currentPage--;
    
    getPosts = (currentPage: number, count: number, creatorId?: string) => {
        this.status = PostsStoreStatus.Loading;

        postsService.getPosts(currentPage * count, count, creatorId).then(
            (getPostsResult: GetPostsResultDto) => this.getPostsSuccess(getPostsResult, currentPage),
            () => this.getPostsError()
        );
    }
    
    getPostsSuccess = (getPostsResult: GetPostsResultDto, currentPage: number) => {
        this.posts = getPostsResult.posts;
        this.maxPage = getPostsResult.maxPage;
        this.currentPage = currentPage;
        this.status = PostsStoreStatus.Success;
    }
    getPostsError = () => this.status = PostsStoreStatus.Error;

    createPost = async (postToAdd: PostToAddDto) => {
        this.status = PostsStoreStatus.Loading;

        postsService.postPost(postToAdd).then(
            (response) => {
                if (response.status === 201) {
                    this.createPostsSuccess();
                }
                else {
                    this.createPostsError();
                }
            },
            () => this.createPostsError()
        );
    }

    createPostsSuccess = () => this.status = PostsStoreStatus.Success;
    createPostsError = () => this.status = PostsStoreStatus.Error;
    
    editPost = async (postToEdit: PostToEditDto) => {
        this.status = PostsStoreStatus.Loading

        postsService.putPost(postToEdit).then(
            (response) => {
                if (response.status === 204) {
                    this.editPostsSuccess();
                }
                else {
                    this.editPostsError();
                }
            },
            () => this.editPostsError()
        );
    }
    
    editPostsSuccess = () => this.status = PostsStoreStatus.Success;
    editPostsError = () => this.status = PostsStoreStatus.Error;
    
    deletePost = async (id: string) => {
        this.status = PostsStoreStatus.Loading

        postsService.deletePost(id).then(
            (response) => {
                if (response.status === 204) {
                    this.deletePostsSuccess();
                }
                else {
                    this.deletePostsError();
                }
            },
            () => this.deletePostsError()
        );
    }
    
    deletePostsSuccess = () => this.status = PostsStoreStatus.Success;
    deletePostsError = () => this.status = PostsStoreStatus.Error;
}

export const PostsStore = new Posts();

const PostsStoreContext = createContext(PostsStore);

export const usePostsStore = () => {
    return useContext(PostsStoreContext);
}