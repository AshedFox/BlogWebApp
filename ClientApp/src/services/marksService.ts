import {PostMarkToEditDto} from "../DTOs/PostMarkToEditDto";
import {CommentMarkToEditDto} from "../DTOs/CommentMarkToEditDto";
import {PostMarkToAddDto} from "../DTOs/PostMarkToAddDto";
import {CommentMarkToAddDto} from "../DTOs/CommentMarkToAddDto";

const apiUrl = window.location.origin + "/api/marks";

const getPostMarks = async (postId: string) => {
    const options: RequestInit = {
        method: "GET",
    }
    
    const request = new Request(apiUrl + `/getPostMarks/${postId}`, options);

    return await fetch(request);
}

const getUserPostsMarks = async (userId: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/getUserPostsMarks/${userId}`, options);

    return await fetch(request);
}

const getPostMark = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/getPostMark/${id}`, options);

    return await fetch(request);
}

const markPost = async (postMarkToAdd: PostMarkToAddDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options:RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(postMarkToAdd)
    }
    const request = new Request(apiUrl + "/markPost", options);

    return await fetch(request);
}

const changePostMark = async (id: string, postMarkToEdit: PostMarkToEditDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "PUT",
        headers,
        body: JSON.stringify(postMarkToEdit)
    }
    const request = new Request(apiUrl + `/changePostMark/${id}`, options);

    return await fetch(request);
}

const unmarkPost = async (id: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "DELETE",
        headers
    }
    const request = new Request(apiUrl + `/unmarkPost/${id}`, options);

    return await fetch(request);
}

const getCommentMarks = async (commentId: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/getCommentMarks/${commentId}`, options);

    return await fetch(request);
}

const getUserCommentsMarks = async (userId: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/getUserCommentsMarks/${userId}`, options);

    return await fetch(request);
}

const getCommentMark = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/getCommentMark/${id}`, options);

    return await fetch(request);
}

const markComment = async (commentMarkToAdd: CommentMarkToAddDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options:RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(commentMarkToAdd)
    }
    const request = new Request(apiUrl + "/markComment", options);

    return await fetch(request);
}

const changeCommentMark = async (id: string, commentMarkToEdit: CommentMarkToEditDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "PUT",
        headers,
        body: JSON.stringify(commentMarkToEdit)
    }
    const request = new Request(apiUrl + `/changeCommentMark/${id}`, options);

    return await fetch(request);
}

const unmarkComment = async (id: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "DELETE",
        headers
    }
    const request = new Request(apiUrl + `/unmarkComment/${id}`, options);

    return await fetch(request);
}

const marksService = {
    getPostMarks,
    getUserPostsMarks,
    getPostMark,
    markPost,
    changePostMark,
    unmarkPost,
    getCommentMarks,
    getUserCommentsMarks,
    getCommentMark,
    markComment,
    changeCommentMark,
    unmarkComment
}

export default marksService;
