import {PostToAddDto} from "../DTOs/PostToAddDto";
import {PostToEditDto} from "../DTOs/PostToEditDto";

const apiUrl = window.location.origin + "/api/posts";

const getPosts = async (offset: number, limit: number, title?: string,
                        startDateTime?:string, endDateTime?: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    let urlParams = new URLSearchParams({
        offset: String(offset),
        limit: String(limit)
    });
    
    if (title) {
        urlParams.append("title", title);
    }
    
    if (startDateTime) {
        urlParams.append("startDateTime", startDateTime);
    }

    if (endDateTime) {
        urlParams.append("endDateTime", endDateTime);
    }
    
    const request = new Request(apiUrl + "?" + urlParams, options);
    
    return await fetch(request);
}

const getUserPosts = async (userId: string) => {
    const options: RequestInit = {
        method: "GET",
    }

    const request = new Request(apiUrl + `/getUserPosts/${userId}`, options);

    return await fetch(request);
}

const getPost = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
    }
    
    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
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

const putPost = async (id: string, postToEdit: PostToEditDto) => {
    const headers = new Headers();
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
    const headers = new Headers();
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
    getUserPosts,
    getPost,
    postPost,
    putPost,
    deletePost
}

export default postsService;
