import {makeAuthHeader} from "../helpers/authHeader";

const apiUrl = window.location.origin + "/api/files";

const getFile = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
        headers: makeAuthHeader()
    }

    const request = new Request(apiUrl + `/${id}`, options);

    return await fetch(request);
}

const postFile = async (file: File) => {
    const headers = new Headers(makeAuthHeader());

    const formData = new FormData();
    formData.append("file", file);

    const options: RequestInit = {
        method: "POST",
        headers,
        body: formData
    }

    const request = new Request(apiUrl, options);

    return await fetch(request);
}

const filesService = {
    getFile,
    postFile
}

export default filesService;