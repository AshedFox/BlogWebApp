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
    
    getPosts = (currentPage: number, count: number, creatorId?: string) => {
        this.status = PostsStoreStatus.GetPostsLoading;

        return postsService.getPosts(currentPage * count, count, creatorId).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (getPostsResult: GetPostsResultDto) => {
                            if (currentPage <= getPostsResult.maxPage) {
                                this.getPostsSuccess(getPostsResult)
                                return getPostsResult;
                            }
                            else {
                                this.getPostsError();
                                return null;
                            }
                        },
                        () => {
                            this.getPostsError()
                            return null;
                        }
                    )
                }
                else {
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
    
    getPostsSuccess = (getPostsResult: GetPostsResultDto) => {
        this.posts = getPostsResult.posts;
        this.maxPage = getPostsResult.maxPage;
        this.status = PostsStoreStatus.GetPostsSuccess;
    }
    getPostsError = () => this.status = PostsStoreStatus.GetPostsError;

    getPost = (id: string) => {
        this.status = PostsStoreStatus.GetPostLoading;

        return postsService.getPost(id).then(
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
                }
                else {
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
    getPostSuccess = (post: PostModel) => {
        this.currentPost = post;
        this.status = PostsStoreStatus.GetPostSuccess;
    }
    getPostError = () => this.status = PostsStoreStatus.GetPostError;

    createPost = (postToAdd: PostToAddDto) => {
        this.status = PostsStoreStatus.CreatePostLoading;

        return postsService.postPost(postToAdd).then(
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
                }
                else {
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
    createPostSuccess = () => this.status = PostsStoreStatus.CreatePostSuccess;
    createPostError = () => this.status = PostsStoreStatus.CreatePostError;
    
    editPost = (id: string, postToEdit: PostToEditDto) => {
        this.status = PostsStoreStatus.EditPostLoading

        return postsService.putPost(id, postToEdit).then(
            (response) => {
                if (response.status === 204) {
                    this.editPostSuccess();
                }
                else {
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
    editPostSuccess = () => this.status = PostsStoreStatus.EditPostSuccess;
    editPostError = () => this.status = PostsStoreStatus.EditPostError;
    
    deletePost = (id: string) => {
        this.status = PostsStoreStatus.DeletePostLoading

        return postsService.deletePost(id).then(
            (response) => {
                if (response.status === 204) {
                    this.deletePostSuccess();
                }
                else {
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
    deletePostSuccess = () => this.status = PostsStoreStatus.DeletePostSuccess;
    deletePostError = () => this.status = PostsStoreStatus.DeletePostError;
    
    // comments
    addCommentToCurrentPost = (comment:CommentModel) => {
        if (comment.post && comment.post.id && comment.post.id == this.currentPost?.id) {
            this.currentPost.comments = [...this.currentPost.comments, comment].sort(
                (a, b) =>
                    new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
            );
        }
    }
    
    getComments = (postId?: string) => {
        this.status = PostsStoreStatus.GetCommentsLoading;
        
        return commentsService.getComments(postId).then(
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
                }
                else {
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
    getCommentsSuccess = (comments: CommentModel[]) => {
        if (this.currentPost) {
            this.currentPost.comments = comments;
        }
        this.status = PostsStoreStatus.GetCommentsSuccess;
    }
    getCommentsError = () => this.status = PostsStoreStatus.GetCommentsError;
    
    getComment = (id: string) => {
        this.status = PostsStoreStatus.GetCommentLoading;

        return commentsService.getComment(id).then(
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
                }
                else {
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
    getCommentSuccess = () => this.status = PostsStoreStatus.GetCommentSuccess;
    getCommentError = () => this.status = PostsStoreStatus.GetCommentError;
    
    createComment = (commentToAdd: CommentToAddDto) => {
        this.status = PostsStoreStatus.CreateCommentLoading;

        return commentsService.postComment(commentToAdd).then(
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
                }
                else {
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
    createCommentSuccess = () => this.status = PostsStoreStatus.CreateCommentSuccess;
    createCommentError = () => this.status = PostsStoreStatus.CreateCommentError;
    
    editComment = (id: string, commentToEdit: CommentToEditDto) => {
        this.status = PostsStoreStatus.EditCommentLoading;
        
        return commentsService.putComment(id, commentToEdit).then(
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
    editCommentSuccess = () => this.status = PostsStoreStatus.EditCommentSuccess;
    editCommentError = () => this.status = PostsStoreStatus.EditCommentError;
    
    deleteComment = (id: string) => {
        this.status = PostsStoreStatus.DeleteCommentLoading;

        return commentsService.deleteComment(id).then(
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
    deleteCommentSuccess = () => this.status = PostsStoreStatus.DeleteCommentSuccess;
    deleteCommentError = () => this.status = PostsStoreStatus.DeleteCommentError;
}

export const PostsStore = new Posts();

const PostsStoreContext = createContext(PostsStore);

export const usePostsStore = () => {
    return useContext(PostsStoreContext);
}