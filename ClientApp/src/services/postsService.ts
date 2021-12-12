import {PostToAddDto} from "../DTOs/PostToAddDto";
import {PostToEditDto} from "../DTOs/PostToEditDto";
import {makeAuthHeader} from "../helpers/authHeader";

const apiUrl = window.location.origin + "/api/posts";

const getPosts = async (offset: number, limit: number, creatorId?: string) => {
    const options: RequestInit = {
        method: "GET",
        headers: makeAuthHeader()
    }

    let urlParams = new URLSearchParams();
    urlParams.append("offset", String(offset));
    urlParams.append("limit", String(limit));

    if (creatorId) {
        urlParams.append("creatorId", creatorId);
    }

    const request = new Request(apiUrl + "?" + urlParams, options);
    
    return await fetch(request);
}

const getPost = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
        headers: makeAuthHeader()
    }
    
    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const postPost = async (postToAdd: PostToAddDto) => {
    const headers = new Headers(makeAuthHeader());
    headers.append("Content-Type", "application/json");

    const options:RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(postToAdd)
    }
    const request = new Request(apiUrl, options);

    return await fetch(request);
}

const putPost = async (id: string, postToEdit: PostToEditDto) => {
    const headers = new Headers(makeAuthHeader());
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "PUT",
        headers,
        body: JSON.stringify(postToEdit)
    }
    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const deletePost = async (id: string) => {
    const headers = new Headers(makeAuthHeader());
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "DELETE",
        headers
    }
    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const postsService = {
    getPosts,
    getPost,
    postPost,
    putPost,
    deletePost
}

export default postsService;
