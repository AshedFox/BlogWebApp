import {makeAutoObservable} from "mobx";
import {PostToAddDto} from "../DTOs/PostToAddDto";
import {PostToEditDto} from "../DTOs/PostToEditDto";
import {PostModel} from "../models/PostModel";
import postsService from "../services/postsService";
import {createContext, useContext} from "react";
import {GetPostsResultDto} from "../DTOs/GetPostsResultDto";
import {AccountStore} from "./AccountStore";
import {CommentToAddDto} from "../DTOs/CommentToAddDto";
import {CommentToEditDto} from "../DTOs/CommentToEditDto";
import commentsService from "../services/commentsService";
import {CommentModel} from "../models/CommentModel";

export enum PostsStoreStatus {
    None = "None",
    GetPostsLoading = "GetPostsLoading",
    GetPostsSuccess = "GetPostsSuccess",
    GetPostsError = "GetPostsError",
    GetPostLoading = "GetPostLoading",
    GetPostSuccess = "GetPostSuccess",
    GetPostError = "GetPostError",
    CreatePostLoading = "CreatePostLoading",
    CreatePostSuccess = "CreatePostSuccess",
    CreatePostError = "CreatePostError",
    EditPostLoading = "EditPostLoading",
    EditPostSuccess = "EditPostSuccess",
    EditPostError = "EditPostError",
    DeletePostLoading = "DeletePostLoading",
    DeletePostSuccess = "DeletePostSuccess",
    DeletePostError = "DeletePostError",
    GetCommentsLoading = "GetCommentsLoading",
    GetCommentsSuccess = "GetCommentsSuccess",
    GetCommentsError = "GetCommentsError",
    GetCommentLoading = "GetCommentLoading",
    GetCommentSuccess = "GetCommentSuccess",
    GetCommentError = "GetCommentError",
    CreateCommentLoading = "CreateCommentLoading",
    CreateCommentSuccess = "CreateCommentSuccess",
    CreateCommentError = "CreateCommentError",
    EditCommentLoading = "EditCommentLoading",
    EditCommentSuccess = "EditCommentSuccess",
    EditCommentError = "EditCommentError",
    DeleteCommentLoading = "DeleteCommentLoading",
    DeleteCommentSuccess = "DeleteCommentSuccess",
    DeleteCommentError = "DeleteCommentError",
}

class Posts {
    constructor() {
        makeAutoObservable(this);
    }

    currentPost?: PostModel;
    posts: PostModel[] = [];
    status = PostsStoreStatus.None;

    currentPage = 0;
    countPerPage = 8;
    maxPage = 0;

    setPage = (page: number) => this.currentPage = page;
    setCurrentPost = (post?: PostModel) => this.currentPost =  post;
    
    getPosts = async (currentPage: number, count: number, creatorId?: string) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.GetPostsLoading;

        return await postsService.getPosts(currentPage * count, count, creatorId).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (getPostsResult: GetPostsResultDto) => {
                            if (currentPage <= getPostsResult.maxPage) {
                                this.getPostsSuccess(getPostsResult)
                                return getPostsResult;
                            } else {
                                this.getPostsError();
                                return null;
                            }
                        },
                        () => {
                            this.getPostsError()
                            return null;
                        }
                    )
                } else {
                    this.getPostsError()

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.getPostsError()
                return null;
            }
        );
    }
    
    private getPostsSuccess = (getPostsResult: GetPostsResultDto) => {
        this.posts = getPostsResult.posts;
        this.maxPage = getPostsResult.maxPage;
        this.status = PostsStoreStatus.GetPostsSuccess;
    }
    private getPostsError = () => this.status = PostsStoreStatus.GetPostsError;

    getPost = async (id: string) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.GetPostLoading;

        return await postsService.getPost(id).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (post: PostModel) => {
                            this.getPostSuccess(post);
                            return post;
                        },
                        () => {
                            this.getPostError();
                            return null;
                        }
                    )
                } else {
                    this.getPostError()

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.getPostError()
                return null;
            }
        );
    }
    private getPostSuccess = (post: PostModel) => {
        this.currentPost = post;
        this.status = PostsStoreStatus.GetPostSuccess;
    }
    private getPostError = () => this.status = PostsStoreStatus.GetPostError;

    createPost = async (postToAdd: PostToAddDto) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.CreatePostLoading;

        return await postsService.postPost(postToAdd).then(
            (response) => {
                if (response.status === 201) {
                    return response.json().then(
                        (post: PostModel) => {
                            this.createPostSuccess();
                            return post;
                        },
                        () => {
                            this.createPostError();
                            return null;
                        }
                    )
                } else {
                    this.createPostError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.createPostError()
                return null;
            }
        );
    }
    private createPostSuccess = () => this.status = PostsStoreStatus.CreatePostSuccess;
    private createPostError = () => this.status = PostsStoreStatus.CreatePostError;
    
    editPost = async (id: string, postToEdit: PostToEditDto) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.EditPostLoading

        await postsService.putPost(id, postToEdit).then(
            (response) => {
                if (response.status === 204) {
                    this.editPostSuccess();
                } else {
                    this.editPostError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                }
            },
            () => {
                this.editPostError()
            }
        );
    }
    private editPostSuccess = () => this.status = PostsStoreStatus.EditPostSuccess;
    private editPostError = () => this.status = PostsStoreStatus.EditPostError;
    
    deletePost = async (id: string) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.DeletePostLoading

        await postsService.deletePost(id).then(
            (response) => {
                if (response.status === 204) {
                    this.deletePostSuccess();
                } else {
                    this.deletePostError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                }
            },
            () => {
                this.deletePostError()
            }
        );
    }
    private deletePostSuccess = () => this.status = PostsStoreStatus.DeletePostSuccess;
    private deletePostError = () => this.status = PostsStoreStatus.DeletePostError;
    
    // comments
    addCommentToCurrentPost = (comment:CommentModel) => {
        if (comment.post && comment.post.id && comment.post.id === this.currentPost?.id) {
            this.currentPost.comments = [...this.currentPost.comments, comment].sort(
                (a, b) =>
                    new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
            );
        }
    }
    
    getComments = async (postId?: string) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.GetCommentsLoading;

        return await commentsService.getComments(postId).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (comments: CommentModel[]) => {
                            this.getCommentsSuccess(comments)
                            return comments;
                        },
                        () => {
                            this.getCommentsError()
                            return null;
                        }
                    )
                } else {
                    this.getCommentsError()

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.getCommentsError()
                return null;
            }
        );
    }
    private getCommentsSuccess = (comments: CommentModel[]) => {
        if (this.currentPost) {
            this.currentPost.comments = comments;
        }
        this.status = PostsStoreStatus.GetCommentsSuccess;
    }
    private getCommentsError = () => this.status = PostsStoreStatus.GetCommentsError;
    
    getComment = async (id: string) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.GetCommentLoading;

        return await commentsService.getComment(id).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (comment: CommentModel) => {
                            this.getCommentSuccess();
                            return comment;
                        },
                        () => {
                            this.getCommentError();
                            return null;
                        }
                    )
                } else {
                    this.getCommentError()

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.getCommentError()
                return null;
            }
        );
    }
    private getCommentSuccess = () => this.status = PostsStoreStatus.GetCommentSuccess;
    private getCommentError = () => this.status = PostsStoreStatus.GetCommentError;
    
    createComment = async (commentToAdd: CommentToAddDto) => {
        await AccountStore.refreshTokenIfNeeded();

        this.status = PostsStoreStatus.CreateCommentLoading;

        return await commentsService.postComment(commentToAdd).then(
            (response) => {
                if (response.status === 201) {
                    return response.json().then(
                        (comment: CommentModel) => {
                            this.createCommentSuccess();
                            return comment;
                        },
                        () => {
                            this.createCommentError();
                            return null;
                        }
                    )
                } else {
                    this.createCommentError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.createCommentError()
                return null;
            }
        );
    }
    private createCommentSuccess = () => this.status = PostsStoreStatus.CreateCommentSuccess;
    private createCommentError = () => this.status = PostsStoreStatus.CreateCommentError;
    
    editComment = async (id: string, commentToEdit: CommentToEditDto) => {
        await AccountStore.refreshTokenIfNeeded();
        
        this.status = PostsStoreStatus.EditCommentLoading;
        
        await commentsService.putComment(id, commentToEdit).then(
            (response) => {
                if (response.status === 204) {
                    this.editCommentSuccess();
                }
                else {
                    this.editCommentError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                }
            },
            () => {
                this.editCommentError()
            }
        );
    }
    private editCommentSuccess = () => this.status = PostsStoreStatus.EditCommentSuccess;
    private editCommentError = () => this.status = PostsStoreStatus.EditCommentError;
    
    deleteComment = async (id: string) => {
        await AccountStore.refreshTokenIfNeeded()

        this.status = PostsStoreStatus.DeleteCommentLoading;

        await commentsService.deleteComment(id).then(
            (response) => {
                if (response.status === 204) {
                    this.deleteCommentSuccess();
                }
                else {
                    this.deleteCommentError();

                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                }
            },
            () => {
                this.deleteCommentError()
            }
        );
    }
    private deleteCommentSuccess = () => this.status = PostsStoreStatus.DeleteCommentSuccess;
    private deleteCommentError = () => this.status = PostsStoreStatus.DeleteCommentError;
}

export const PostsStore = new Posts();

const PostsStoreContext = createContext(PostsStore);

export const usePostsStore = () => {
    return useContext(PostsStoreContext);
}