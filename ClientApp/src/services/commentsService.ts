import {CommentToAddDto} from "../DTOs/CommentToAddDto";
import {CommentToEditDto} from "../DTOs/CommentToEditDto";
import {makeAuthHeader} from "../helpers/authHeader";

const apiUrl = window.location.origin + "/api/comments";

const getComments = async (postId?: string) => {
    const options: RequestInit = {
        method: "GET",
        headers: makeAuthHeader()
    }

    let urlParams = new URLSearchParams();

    if (postId) {
        urlParams.append("postId", postId);
    }

    const request = new Request(apiUrl + "?" + urlParams, options);

    return await fetch(request);
}

const getComment = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
        headers: makeAuthHeader()
    }

    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const postComment = async (commentToAdd: CommentToAddDto) => {
    const headers = new Headers(makeAuthHeader());
    headers.append("Content-Type", "application/json");

    const options:RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(commentToAdd)
    }
    const request = new Request(apiUrl, options);

    return await fetch(request);
}

const putComment = async (id: string, commentToEdit: CommentToEditDto) => {
    const headers = new Headers(makeAuthHeader());
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "PUT",
        headers,
        body: JSON.stringify(commentToEdit)
    }
    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const deleteComment = async (id: string) => {
    const headers = new Headers(makeAuthHeader());
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "DELETE",
        headers
    }
    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const commentsService = {
    getComments,
    getComment,
    postComment,
    putComment,
    deleteComment
}

export default commentsService;
