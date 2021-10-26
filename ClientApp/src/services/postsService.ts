import {PostToAddDto} from "../DTOs/PostToAddDto";
import {PostToEditDto} from "../DTOs/PostToEditDto";

const apiUrl = window.location.origin + "/api/posts";

const getPosts = async (offset: number, limit: number, creatorId?: string) => {
    const options:RequestInit = {
        method: "GET",
    }

    let urlParams = new URLSearchParams();
    urlParams.append("offset", String(offset));
    urlParams.append("limit", String(limit));

    if (creatorId) {
        urlParams.append("creatorId", creatorId);
    }

    const request = new Request(apiUrl + "?" + urlParams, options);

    const response = await fetch(request);
    return response.json();
}

const postPost = async (postToAdd: PostToAddDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(postToAdd)
    }
    const request = new Request(apiUrl, options);

    return await fetch(request);
}

const putPost = async (postToEdit: PostToEditDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "PUT",
        headers,
        body: JSON.stringify(postToEdit)
    }
    const request = new Request(apiUrl, options);

    return await fetch(request);
}

const deletePost = async (id: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "DELETE",
        headers
    }
    const request = new Request(apiUrl + "/" + id, options);

    return await fetch(request);
}

const postsService = {
    getPosts,
    postPost,
    putPost,
    deletePost
}

export default postsService;
