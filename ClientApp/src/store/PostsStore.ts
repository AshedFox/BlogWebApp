import {makeAutoObservable} from "mobx";
import {PostToAddDto} from "../DTOs/PostToAddDto";
import {PostToEditDto} from "../DTOs/PostToEditDto";
import {PostModel} from "../models/PostModel";
import postsService from "../services/postsService";
import {createContext, useContext} from "react";
import {GetPostsResultDto} from "../DTOs/GetPostsResultDto";
import {AccountStore} from "./AccountStore";

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
    countPerPage = 8;
    maxPage = 0;

    setPage = (page: number) => this.currentPage = page;
    setNextPage = () => this.currentPage++;
    setPrevPage = () => this.currentPage--;
    
    getPosts = (currentPage: number, count: number, creatorId?: string) => {
        this.status = PostsStoreStatus.Loading;

        postsService.getPosts(currentPage * count, count, creatorId).then(
            (response) => {
                if (response.status === 200) {
                    response.json().then(
                        (getPostsResult: GetPostsResultDto) => this.getPostsSuccess(getPostsResult, currentPage),
                        () => this.getPostsError()
                    )
                }
                else {
                    this.getPostsError()

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                }
            },
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

    createPost = (postToAdd: PostToAddDto) => {
        this.status = PostsStoreStatus.Loading;

        postsService.postPost(postToAdd).then(
            (response) => {
                if (response.status === 201) {
                    this.createPostsSuccess();
                }
                else {
                    this.createPostsError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                }
            },
            () => this.createPostsError()
        );
    }

    createPostsSuccess = () => this.status = PostsStoreStatus.Success;
    createPostsError = () => this.status = PostsStoreStatus.Error;
    
    editPost = (postToEdit: PostToEditDto) => {
        this.status = PostsStoreStatus.Loading

        postsService.putPost(postToEdit).then(
            (response) => {
                if (response.status === 204) {
                    this.editPostsSuccess();
                }
                else {
                    this.editPostsError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                }
            },
            () => this.editPostsError()
        );
    }
    
    editPostsSuccess = () => this.status = PostsStoreStatus.Success;
    editPostsError = () => this.status = PostsStoreStatus.Error;
    
    deletePost = (id: string) => {
        this.status = PostsStoreStatus.Loading

        postsService.deletePost(id).then(
            (response) => {
                if (response.status === 204) {
                    this.deletePostsSuccess();
                }
                else {
                    this.deletePostsError();
                    
                    if (response.status === 401) {
                        AccountStore.logout();
                    }
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