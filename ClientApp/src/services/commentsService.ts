import {CommentToAddDto} from "../DTOs/CommentToAddDto";
import {CommentToEditDto} from "../DTOs/CommentToEditDto";

const apiUrl = window.location.origin + "/api/comments";

const getComments = async (postId?: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    let urlParams = new URLSearchParams();

    if (postId) {
        urlParams.append("postId", postId);
    }

    const request = new Request(apiUrl + "?" + urlParams, options);

    return await fetch(request);
}

const getUserComments = async (userId: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/getUserComments/${userId}`, options);

    return await fetch(request);
}

const getComment = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const postComment = async (commentToAdd: CommentToAddDto) => {
    const headers = new Headers();
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
    const headers = new Headers();
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
    const headers = new Headers();
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
    getUserComments,
    getComment,
    postComment,
    putComment,
    deleteComment
}

export default commentsService;
